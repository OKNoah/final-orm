import User, {Session} from '../models/user'
import ApiError from './errors/api-error'
import ss from 'socket.io-stream'
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


	static async callMethod(name, params, context) {
		let method = this.methods[name.toLowerCase()]
		if (!method) {
			throw new ApiError(1, name)
		}
		let paramsStorage = new ParamsStorage(params)
		return method.call(context, paramsStorage)
	}


	static async connect() {
		this.io = socketIo(config.port, {})
		this.io.on('connection', socket => this.onConnection(socket))
	}


	static async getSession(socket) {
		let cookiesString = socket.sio.conn.request.headers.cookie
		let cookies = cookie.parse(cookiesString)
		let sessionKey = cookies['session-key']
		return await Session.getByKey(sessionKey)
	}


	static async onConnection(socket) {
		socket = ss(socket)
		let session = await this.getSession(socket)
		let user = await User.getBySession(session)
		let connection = new Connection(this, socket, user, session)
	}

}


