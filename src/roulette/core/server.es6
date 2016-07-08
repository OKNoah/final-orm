import EventEmitter  from 'ui-js/core/event-emitter'
import io  from 'socket.io-client'
import ss  from 'socket.io-stream'


export class Server extends EventEmitter {


	constructor() {
		super()
		this.socket = ss(io.connect(`${location.hostname}:8080`))
		this.connected = true
		this.tasksQueue = []
		this.minTime = 10
		this.pending = false
		this.activeRequests = {}
		this.initHandlers()
	}


	initHandlers() {
		this.socket.sio.on('connect', ()=> this.onConnect())
		this.socket.sio.on('connect_error', ()=> this.onConnectError())
		this.socket.on('response', response => this.onServerResponse(response))
	}


	onConnect() {
		this.connected = true
		this.emit('connect')
	}


	onConnectError() {
		this.connected = false
		this.emit('connect-error')
	}


	onServerResponse(response) {
		let id = response.id
		let responses = response.responses
		let request = this.activeRequests[id]
		delete this.activeRequests[id]
		request.complete(responses)
	}


	clearQueue() {
		this.tasksQueue = []
	}


	addToQueue(method, params) {
		let task = new Task(method, params)
		this.tasksQueue.push(task)

		task.on('error', error => {
			this.emit('error', error)
		})

		return task
	}


	sendQueue() {
		let request = new Request(this.tasksQueue)
		this.activeRequests[request.id] = request
		this.socket.emit('request', request)
		this.clearQueue()
	}


	async call(method, params) {
		let task = this.addToQueue(method, params)

		if (this.pending) return task.promise
		this.pending = true

		setTimeout(()=> {
			this.sendQueue()
			this.pending = false
		}, this.minTime)

		return task.promise
	}


}


class Request {

	static lastId = 0

	static createId() {
		return this.lastId++
	}

	constructor(tasks) {
		this.tasks = tasks
		this.id = Request.createId()
	}


	complete(responses) {
		this.tasks.forEach((tack, index) => {
			let response = responses[index]
			tack.complete(response)
		})
	}


	toJSON() {
		return {
			tasks: this.tasks,
			id: this.id,
		}
	}


}


class Task extends EventEmitter {

	constructor(method, params = {}) {
		super()
		this.method = method
		this.params = Task.wrapFilesToStream(this.clearParams(params))
		this.resolve = null
		this.reject = null
		this.promise = new Promise((resolve, reject)=> {
			this.resolve = resolve
			this.reject = reject
		})

		this.promise.catch(error => {
			this.emit('error', error)
		})
	}


	clearParams(obj) {
		return JSON.parse(JSON.stringify(obj))
	}


	complete(response) {
		if (response.error != null) {
			let errorData = response.error
			let error = new ApiError(response.error)
			this.reject(error)
		}
		else {
			this.resolve(response.result)
		}
	}


	toJSON() {
		return {
			method: this.method,
			params: this.params,
		}
	}


	static wrapFilesToStream(data, buffer = []) {
		if (!(data instanceof Object)) return data
		if (buffer.indexOf(data) !== -1) return data
		buffer.push(data)

		// stream wrapper
		if (data instanceof Blob) {
			let stream = ss.createStream()
			ss.createBlobReadStream(data).pipe(stream)
			return stream
		}

		let wrapper = Array.isArray(data) ? [] : {}

		for (let key in data) if (data.hasOwnProperty(key)) {
			let value = data[key]
			wrapper[key] = this.wrapFilesToStream(value, buffer)
		}

		return wrapper
	}

}


class ApiError {

	constructor(errorData) {

		if (errorData.textCode) {
			this.message = `${errorData.textCode}: ${errorData.message}`
		} else {
			this.message = errorData.message
		}

		let code = errorData.code
	}

}


export default new Server()


