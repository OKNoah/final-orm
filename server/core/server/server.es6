import User, {Session} from '../../models/user'
import Params from './params'
import ApiError from './errors/api-error'
import Connection from './connection'
import ss from 'socket.io-stream'
import socketIo from 'socket.io'
import config from '../../config'
import cookie from 'cookie'
import API from '../api'


export default class Server {

	static io = null
	static methods = {}


	static api(apiName, ApiClass) {
		if (!(ApiClass.prototype instanceof API)) {
			throw new Error('ApiClass must instanceof API')
		}

		let api = new ApiClass()

		let methodNames = this.getApiMethodNames(api)
		for (let key of methodNames) {
			let name = `${apiName}.${key}`.toLowerCase()
			let method = api[key].bind(api)
			this.methods[name] = method
		}
	}


	static getApiMethodNames(context) {
		let methodNames = []

		while (context) {
			let keys = Object.getOwnPropertyNames(context)
			for (let key of keys) if (key !== 'constructor') {
				if (methodNames.indexOf(key) !== -1) continue
				methodNames.push(key)
			}
			context = Object.getPrototypeOf(context)
		}

		return methodNames
	}


	static async callMethod(name, params, connection) {
		let method = this.methods[name.toLowerCase()]
		if (!method) {
			throw new ApiError(1, name)
		}
		let paramsStorage = new Params(params, connection)
		return method(paramsStorage, connection)
	}


	static async connect() {
		this.io = socketIo(config.port, {})
		this.io.on('connection', socket => this.onConnection(socket))
	}


	static async getSession(cookies) {
		let sessionKey = cookies['session-key']
		return await Session.getByKey(sessionKey)
	}


	static getCookies(socket) {
		let cookiesString = socket.sio.conn.request.headers.cookie
		let cookies = cookie.parse(cookiesString)
		return cookies
	}


	static getHeaders(socket) {
		let headers = socket.sio.conn.request.headers
		return headers
	}


	static async onConnection(socket) {
		socket = ss(socket)
		let cookies = this.getCookies(socket)
		let session = await this.getSession(cookies)
		let user = await User.getBySession(session)
		let headers = this.getHeaders(socket)

		let connection = new Connection(this, socket, user, session, headers, cookies)
	}

}


