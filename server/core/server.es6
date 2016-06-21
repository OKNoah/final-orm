import {Api} from "./list"
import config from '../config'
import ss from 'socket.io-stream'
import socketIo from 'socket.io'


export class Server {


	constructor(port) {
		this.io = socketIo(port, {})
		this.methods = {}
		this.initHandlers()
	}


	initHandlers() {
		this.io.on('connection', this.onConnection.bind(this))
	}


	onConnection(socket) {
		let socketStream = ss(socket)
		socketStream.on('request', this.onRequest.bind(this, socketStream))
	}


	async onRequest(socket, request) {
		let data = request.data
		let method = request.method
		let response = new Request(socket, request)

		try {
			let result = await this.callApi(method, data, response)
			response.send(result)
		} catch (error) {
			response.serverError(error)
		}
	}


	callApi(methodName, data, request) {
		methodName = methodName.toLowerCase()
		let method = this.methods[methodName]
		if (!method) {
			request.error(`Unknown method "${methodName}"`)
			return
		}
		return method.call(data, request)
	}


	addApi(api) {
		let keys = Api.getMethodNames(api)

		keys.forEach((key) => {
			let func = api[key]
			let methodName = `${api.name}.${key}`.toLowerCase()
			this.methods[methodName] = new Method(func, api)
		})
	}


}


class Method {

	constructor(func, context) {
		this.func = func
		this.context = context
	}

	call(data, request) {
		return this.func.call(this.context, data, request)
	}

}


export class Request {


	constructor(socket, requestData) {
		this.socket = socket
		this.requestData = requestData
		this.completed = false
	}


	send(data) {
		if (this.completed) return
		this.completed = true
		this.sendData('response', data)
	}


	error(message) {
		if (this.completed) return
		this.completed = true
		this.sendData('err', message)
	}


	serverError(error) {
		console.error(error)
		this.error('Internal server error')
	}


	progress(progress) {
		if (this.completed) return
		this.sendData('progress', progress)
	}


	sendData(type, data) {
		let requestId = this.requestData.requestId

		this.socket.emit(type, {
			requestId: requestId,
			data: data
		})
	}

}


let server = new Server(config.port)
export default server


