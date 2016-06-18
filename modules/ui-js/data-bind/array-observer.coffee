ArraySplice = require('./array-splice') 
PropObserver = require('./prop-observer')
immediate = require('ui-js/polyfill/immediate')

arraySplice = new ArraySplice()


class DirectArrayObserver


	constructor: (@arr)->
		@handlers = []
		@destroyed = false
		@indexChangeHandlers = on
		@indexObservers = []
		@patch()
		return


	destroy: ->
		if @destroyed then return
		@destroyed = true
		@unpatch()
		return


	patch: ->
		@arr.observer = @
		for key, method of patchMethods
			@arr[key] = method
		@updateIndexObservers()
		return


	unpatch: ->
		delete @arr.observer
		for key, method of patchMethods
			delete @arr[key]
		@destroyIndexObservers()
		return


	createSplice: (index, removedCnt, add)->
		removed = @arr.slice(index, index + removedCnt)
		addedCount = if add? then add.length else 0
		if not addedCount and not removedCnt then return null
		return {index, addedCount, removed}


	callMethod: (method, args, index, removedCnt, add)->
		@indexChangeHandlers = off
		splice = @createSplice(index, removedCnt, add)
		returns = Array.prototype[method].apply(@arr, args)
		@indexChangeHandlers = on
		if splice then @arrayWasChange([splice])
		return returns


	arrayWasChange: (splices)->
		@updateIndexObservers()
		@callHandlers(splices)
		return


	callHandlers: (splices)->
		for handler in @handlers
			handler(splices)
		return


	addHandler: (handler)->
		@handlers.push(handler)
		return


	removeHandler: (handler)->
		index = @handlers.indexOf(handler)
		if index isnt -1 then @handlers.splice(index, 1)
		unless @handlers.length then @destroy()
		return


	updateIndexObservers: ->
		olaLength = @indexObservers.length
		currentLength = @arr.length

		if currentLength < olaLength
			count = olaLength - currentLength
			observers = @indexObservers.splice(currentLength, count)
			for observer in observers then observer.destroy()
			for index in [currentLength...olaLength]
				delete @arr[index]

		else if currentLength > olaLength
			for index in [olaLength...currentLength] then do (index)=>
				@indexObservers.push new PropObserver @arr, index, (value, oldValue)=>
					@indexChange(index, oldValue)

		@arr.length = currentLength
		return


	destroyIndexObservers: ->
		for observer in @indexObservers
			observer.destroy()
		return


	indexChange: (index, oldValue)->
		unless @indexChangeHandlers then return
		splice = {index, addedCount: 1, removed: [oldValue]}
		@callHandlers([splice])
		return


	patchMethods =

		splice: (index, removedCnt, add...)->
			return @observer.callMethod('splice', arguments, index, removedCnt, add)

		push: (add...)->
			return @observer.callMethod('push', arguments, @length, 0, add)

		pop: ->
			unless @length then return
			return @observer.callMethod('pop', arguments, @length - 1, 1, [])

		unshift: (add...)->
			return @observer.callMethod('unshift', arguments, 0, 0, add)

		shift: ->
			unless @length then return
			return @observer.callMethod('shift', arguments, 0, 1, [])

		sort: ->
			@indexChangeHandlers = off
			oldArr = @slice()
			returns = Array.prototype.sort.call(@, arguments)
			splices = ArrayObserver.diff(@, oldArr)
			@indexChangeHandlers = on
			if splices.length then @observer.arrayWasChange(splices)
			return returns


module.exports = class ArrayObserver


	@diff: (arr, oldArr)->
		return arraySplice.calculateSplices(arr, oldArr)


	constructor: (@array, @handler)->
		@destroyed = false
		unless @array.observer then new DirectArrayObserver(@array)
		directObserver = @array.observer
		directObserver.addHandler(@handler)
		return


	destroy: ->
		if @destroyed then return
		directObserver = @array.observer
		directObserver.removeHandler(@handler)
		@destroyed = true
		return