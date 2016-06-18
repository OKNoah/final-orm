let io = require('socket.io-client')
let ss = require('socket.io-stream')
let Promise = require('ui-js/core/promise')


export default new class Server {


	constructor(port = 8080) {
		this.socket = ss(io.connect(`${location.hostname}:${port}`))
		this.lastRequestId = 0
		this.requests = {}
		this.socket.on('response', this.onResponse.bind(this))
		this.socket.on('progress', this.onProgress.bind(this))
		this.socket.on('err', this.onError)
	}


	onResponse(serverMessage) {
		let data = serverMessage.data
		let requestId = serverMessage.requestId
		let promise = this.requests[requestId]
		delete this.requests[requestId]
		promise.resolve(data)
	}


	onError(serverMessage) {
		let data = serverMessage.data
		let requestId = serverMessage.requestId
		let promise = this.requests[requestId]
		delete this.requests[requestId]
		promise.reject(data)
	}


	onProgress(serverMessage) {
		let data = serverMessage.data
		let requestId = serverMessage.requestId
		let promise = this.requests[requestId]
		promise.progress(data)
	}


	wrapFilesToStream(data, buffer = []) {
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


	call(method, data) {
		let data = this.wrapFilesToStream(data)
		let promise = new Promise()
		let requestId = this.lastRequestId++
		this.requests[requestId] = promise
		this.socket.emit('request', {data, method, requestId})
		return promise
	}

}

