EventEmitter = require('ui-js/core/event-emitter') 


module.exports = class Promise extends EventEmitter

	PENDING: 'pending'
	RESOLVED: 'resolved'
	REJECTED: 'rejected'
	ABORTED: 'aborted'


	constructor: (resolver)->
		unless @ instanceof Promise
			return new Promise(resolver)

		super
		@status = @PENDING
		@value = undefined
		@queue = []
		@catched = false
		@completed = 0
		@done = false
		@aborted = false
		@description = ''

		try resolver?.call(@, @resolve, @reject, @progress)
		catch error then @reject(error)
		return


	resolve: (value)=>
		if @status isnt @PENDING then return
		@value = value
		@completed = 1
		@done = true
		@status = @RESOLVED
		@run()
		@emit('resolve', @value)
		@emit('done', @value)
		return


	reject: (value)=>
		if @status isnt @PENDING then return
		@value = value
		@completed = 1
		@done = true
		@status = @REJECTED
		@run()
		@emit('reject', @value)
		@emit('done', @value)
		return


	abort: =>
		if @aborted then return
		@status = @ABORTED
		@queue = []
		@aborted = true
		@emit('abort')
		return


	progress: (completed, @description = '')=>
		@completed = Math.max(Math.min(completed, 1), 0)
		return @emit('progress', @completed, @description)


	run: ->
		if @status is @PENDING then return
		while handlers = @queue.shift()
			switch @status
				when @RESOLVED then handlers.onResolve?.call(@, @value)
				when @REJECTED then if handlers.onReject
					handlers.onReject.call(@, @value)
					@catched = true

		if @status is @REJECTED and !@catched
			console.error 'Promise error', @value
			throw @value
		return


	then: (onResolve, onReject, onProgress)->
		promise = new Promise()
		promise.on('progress', onProgress) if onProgress
		promise.on('abort', @abort)
		@on('progress', promise.progress)

		handler = (value)=>
			try
				func = if @status is @RESOLVED then onResolve else onReject
				if func then value = func.call(@, value)
				else if @status is @REJECTED then promise.reject(value)
				if Promise.thenable(value)
					value.then(promise.resolve, promise.reject)
					value.on('progress', promise.progress)
				else promise.resolve(value)
			catch error then promise.reject(error)

		@queue.push
			onResolve: handler
			onReject: handler

		@run()
		return promise


	catch: (onReject)->
		return @then(null, onReject)


	finally: (handler)->
		return @on('done', handler)


	####################################
	# static
	####################################
	Promise.thenable = (item)->
		return typeof item?.then is 'function'


	Promise.resolve = (value)->
		promise = new Promise
		promise.resolve(value)
		return promise


	Promise.reject = (value)->
		promise = new Promise
		promise.reject(value)
		return promise


	Promise.all = (promises, description = '')->
		promises = promises.slice()
		all = new Promise
		values = []
		resolvedCnt = 0

		promises.forEach (promise, index)->
			promise.then (value)->
				values[index] = value
				if ++resolvedCnt is promises.length then all.resolve(values)
				return
			, all.reject

			promise.on 'progress', (completed)=>
				allCompleted = 0
				promises.forEach (promise)-> allCompleted += promise.completed
				totalCompleted = allCompleted / promises.length
				all.progress(totalCompleted, '')
				return


		return all

