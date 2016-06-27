import User from '../models/user'
import config from '../config'

let ss = require('socket.io-stream')
let socketIo = require('socket.io')
let cookie = require('cookie')


export default class Connection {

	static io = null
	static methods = {}


	static addMethods(obj) {
		for (let key in obj) if (obj.hasOwnProperty(key)) {
			let method = obj[key]
			this.methods[key] = method
		}
	}


	static async callMethod(name, args, context) {
		let method = this.methods[name]
		if (!method) {
			throw Error(`Нет такого метода '${name}'`)
		}
		return method.call(context, ...args)
	}


	static async connect() {
		this.io = socketIo(config.port, {})
		this.io.on('connection', socket => this.onConnection(socket))
	}


	static async onConnection(socket) {
		socket = ss(socket)
		let user = await this.getUser(socket)
		let connection = new this(socket, user)
	}


	static async getUser(socket) {
		let cookiesString = socket.sio.conn.request.headers.cookie
		let cookies = cookie.parse(cookiesString)
		let sessionKey = cookies['session-key']
		return await User.getBySessionKey(sessionKey)
	}


	constructor(socket, user) {
		this.socket = socket
		this.user = user
		this.initHandlers()
	}


	initHandlers() {
		this.socket.on('request', request => this.onRequest(request))
	}


	async onRequest(request) {
		let tasks = request.tasks
		let id = request.id
		tasks = tasks.map(options => new Task(this, options))
		for (let task of tasks) {
			await task.run()
		}
		let responses = tasks.map(task => task.toJSON())
		this.sendResponse(responses, id)
	}


	sendResponse(responses, id) {
		this.socket.emit('response', {
			responses: responses,
			id: id
		})
	}

}


class Task {

	constructor(connection, options) {
		this.connection = connection
		this.method = options.method
		this.args = options.args

		this.done = false
		this.error = null
		this.result = null
	}


	resolve(result) {
		if (this.done) return
		this.result = result
		this.done = true
	}


	reject(error) {
		if (this.done) return
		this.error = error
		this.done = true
	}


	async run() {
		try {
			var result = await Connection.callMethod(this.method, this.args, this)
		} catch (error) {
			this.reject(error)
		}
		this.resolve(result)
	}


	toJSON() {
		return {
			error: this.error,
			result: this.result
		}
	}

}


Connection.connect()




