fastApply = (args) ->  
	func = args[0]
	switch args.length
		when 1
			return func()
		when 2
			return func(args[1])
		when 3
			return func(args[1], args[2])
	return func.apply(window, slice.call(args, 1))


callback = (event) ->
	key = event.data
	data = undefined
	if typeof key == 'string' and key.indexOf(message) == 0
		data = storage[key]
		if data
			delete storage[key]
			fastApply data
	return


uid = 0
storage = {}
firstCall = true
slice = Array::slice
message = 'setImmediatePolyfillMessage'


setImmediate = ->
	id = uid++
	key = message + id
	i = arguments.length
	args = new Array(i)
	while i--
		args[i] = arguments[i]
	storage[key] = args
	if firstCall
		firstCall = false
		window.addEventListener 'message', callback
	window.postMessage key, '*'
	return id


clearImmediate = (id) ->
	delete storage[message + id]
	return


immediate = (handler)->
	return setImmediate(handler)


immediate.stop = (id)->
	return clearImmediate(id)


module.exports = immediate



