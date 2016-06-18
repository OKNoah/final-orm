io = require('socket.io-client')
ss = require('socket.io-stream')
Promise = require('ui-js/core/promise')


module.exports = class Server


	constructor: (port = 8080)->
		@socket = ss(io.connect("#{location.hostname}:#{port}"))
		@lastRequestId = 0
		@requests = {}
		@socket.on('response', @onResponse)
		@socket.on('progress', @onProgress)
		@socket.on('err', @onError)
		return


	call: (method, data)->
		data = @wrapFilesToStream(data)
		promise = new Promise()
		requestId = @lastRequestId++
		@requests[requestId] = promise
		@socket.emit('request', {data, method, requestId})
		return promise


	onResponse: (serverMessage)=>
		data = serverMessage.data
		requestId = serverMessage.requestId
		promise = @requests[requestId]
		delete @requests[requestId]
		promise.resolve(data)
		return


	onError: (serverMessage)=>
		data = serverMessage.data
		requestId = serverMessage.requestId
		promise = @requests[requestId]
		delete @requests[requestId]
		promise.reject(data)
		return


	onProgress: (serverMessage)=>
		data = serverMessage.data
		requestId = serverMessage.requestId
		promise = @requests[requestId]
		promise.progress(data)
		return


	wrapFilesToStream: (data, buffer = [])->
		unless data instanceof Object then return data
		if data in buffer then return data
		buffer.push(data)

		# stream wrapper
		if data instanceof Blob
			stream = ss.createStream()
			ss.createBlobReadStream(data).pipe(stream)
			return stream

		wrapper = if Array.isArray(data) then [] else {}
		for own key, value of data
			wrapper[key] = @wrapFilesToStream(value, buffer)
		return wrapper


	send: (file)->

		return @call('users.add', {name: 11, pass: 22, file: file})


		.then (res)=>
			console.log 'users.add response', res
			return

		.catch (error)=>
			console.error 'error', error
			return

		.on 'progress', (percent)=>
			console.log 'progress', percent
			return


