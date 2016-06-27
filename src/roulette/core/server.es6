let io = require('socket.io-client')
let ss = require('socket.io-stream')
let EventEmitter = require('ui-js/core/event-emitter')


let lastId = 0
function createId() {
	return lastId++
}


export default class Server extends EventEmitter {


	constructor() {
		super()
		this.socket = ss(io.connect(`${location.hostname}:8080`))
		this.tasksQueue = []
		this.minTime = 10
		this.pending = false
		this.activeRequests = {}
		this.initHandlers()
	}


	initHandlers() {
		this.socket.sio.on('connect_error', e => this.onConnectError(e))
		this.socket.on('response', response => this.onServerResponse(response))
	}


	onConnectError(e) {
		this.emit('connect-error', e)
	}


	onServerResponse(response) {
		let id = response.id
		let responses = response.responses
		let request = this.activeRequests[id]
		delete this.activeRequests[id]
		request.complete(responses)
	}


	clearTaskQueue() {
		this.tasksQueue = []
	}


	addTaskToQueue(method, args) {
		let task = new Task(method, args)
		this.tasksQueue.push(task)
		return task
	}


	sendTaskQueue() {
		let request = new Request(this.tasksQueue)
		this.activeRequests[request.id] = request
		this.socket.emit('request', request)
		this.clearTaskQueue()
	}


	async call(method, ...args) {
		let task = this.addTaskToQueue(method, args)

		if (this.pending) return task.promise
		this.pending = true

		setTimeout(()=> {
			this.sendTaskQueue()
			this.pending = false
		}, this.minTime)

		return task.promise
	}


}


class Request {

	constructor(tasks) {
		this.tasks = tasks
		this.id = createId()
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


class Task {

	constructor(method, args) {
		this.method = method
		this.args = Task.wrapFilesToStream(args)
		this.resolve = null
		this.reject = null
		this.promise = new Promise((resolve, reject)=> {
			this.resolve = resolve
			this.reject = reject
		})
	}


	complete(response) {
		if (response.error != null) {
			this.reject(response.error)
		}
		else {
			this.resolve(response.result)
		}
	}


	toJSON() {
		return {
			method: this.method,
			args: this.args,
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

