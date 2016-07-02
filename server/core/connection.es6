import ss from 'socket.io-stream'
import User from '../models/user'
import socketIo from 'socket.io'
import config from '../config'
import cookie from 'cookie'


export default class Server {

	static io = null
	static methods = {}


	static addMethods(prefix, obj) {
		for (let key in obj) if (obj.hasOwnProperty(key)) {
			let method = obj[key]
			let name = `${prefix}.${key}`
			this.addMethod(name, method)
		}
	}


	static addMethod(name, method) {
		this.methods[name.toLowerCase()] = method
	}


	static async callMethod(name, args, context) {
		let method = this.methods[name.toLowerCase()]
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
		let connection = new Connection(socket, user)
	}


	static async getUser(socket) {
		let cookiesString = socket.sio.conn.request.headers.cookie
		let cookies = cookie.parse(cookiesString)
		let sessionKey = cookies['session-key']
		return await User.getBySessionKey(sessionKey)
	}

}

// init server
Server.connect()


class Connection {


	constructor(server, socket, user) {
		this.server = server
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
		for (let task of tasks) await task.run()
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






