import EventEmitter  from 'ui-js/core/event-emitter'
import io from 'socket.io-client'
import ss from 'socket.io-stream'


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


	sendQueue() {
		let request = new Request(this.tasksQueue)
		this.activeRequests[request.id] = request
		this.socket.emit('request', request.toJSON())
		this.clearQueue()
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
		this.params = Task.normalize(params)
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


	static normalize(target, buffer = new Map) {
		if (!(target instanceof Object)) return target
		if (buffer.has(target)) return buffer.get(target)

		// stream wrapper
		if (target instanceof Blob) {
			let stream = ss.createStream()
			ss.createBlobReadStream(target).pipe(stream)
			return stream
		}

		if (target.toJSON) target = target.toJSON()
		let wrapper = Array.isArray(target) ? [] : {}
		buffer.set(target, wrapper)

		for (let key in target) if (target.hasOwnProperty(key)) {
			let value = target[key]
			wrapper[key] = this.normalize(value, buffer)
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


