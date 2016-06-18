Map = require('ui-js/polyfill/map') 


module.exports = class PropObserver

	handlerStores = new Map()


	constructor: (@context, @prop, @handler, init = off)->
		@destroyed = false
		@propCanChange = @isPropCanChange()

		if @propCanChange
			handlers = @getHandlersFor(@context, @prop)
			handlers.push(@handler)

		if init then @handler(@context[@prop])
		return


	isPropCanChange: ->
		if @context instanceof File
			return false
		return true


	destroy: ->
		if @destroyed then return
		if @propCanChange
			@removeHandlerFor(@context, @prop, @handler)
		@destroyed = true
		return


	getHandlersFor: (context, prop)->
		unless @hasHandlersFor(context, prop)
			@setHandlersFor(context, prop)
		return handlerStores.get(context)[prop]


	hasHandlersFor: (context, prop)->
		unless handlerStores.has(context)
			return false
		handlerStore = handlerStores.get(context)
		return !!handlerStore[prop]


	removeHandlerFor: (context, prop, handler)->
		handlers = @getHandlersFor(context, prop)
		index = handlers.indexOf(handler)
		if index isnt -1 then handlers.splice(index, 1)
		unless handlers.length
			@clearHandlersFor(context, prop)
		return


	clearHandlersFor: (context, prop)->
		handlerStore = handlerStores.get(context)
		descriptor = handlerStore[prop].descriptor
		value = context[prop]
		delete handlerStore[prop]

		unless descriptor
			unless value? then delete context[prop]
			Object.defineProperty context, prop,
				value: value
				writable: on
				configurable: on
				enumerable: on
		else if descriptor.set
			Object.defineProperty(context, prop, descriptor)
		else
			descriptor.value = context[prop]
			Object.defineProperty(context, prop, descriptor)

		unless Object.keys(handlerStore).length
			handlerStores.delete(context)
		return


	setHandlersFor: (context, prop)->
		unless handlerStores.has(context)
			handlerStores.set(context, {})

		handlers = []
		descriptor = @getDescriptor(context, prop)
		handlerStore = handlerStores.get(context)
		handlers.descriptor = descriptor
		handlerStore[prop] = handlers

		if descriptor and descriptor.get and descriptor.set
			getter = descriptor.get
			setter = descriptor.set
			@setHandlerForSetterMode(context, prop, getter, setter, handlers)
		else
			@setHandlerForValueMode(context, prop, handlers)

		return


	setHandlerForSetterMode: (context, prop, getter, setter, handlers)->
		Object.defineProperty context, prop,
			configurable: on
			get: -> getter.call(@)
			set: (val)->
				value = getter.call(@)
				if (val isnt val) and (value isnt value)
					return # NaN is NaN
				change = val isnt value
				oldValue = value
				setter.call(@, val)
				if change then for handler in handlers.slice()
					handler(val, oldValue)
				return val
		return


	setHandlerForValueMode: (context, prop, handlers)->
		value = context[prop]
		Object.defineProperty context, prop,
			configurable: on
			get: -> value
			set: (val)->
				if (val isnt val) and (value isnt value)
					return # NaN is NaN
				change = val isnt value
				oldValue = value
				value = val
				if change then for handler in handlers.slice()
					handler(value, oldValue)
				return val
		return


	getDescriptor: (context, prop)->
		unless prop of context then return null
		while context
			descriptor = Object.getOwnPropertyDescriptor(context, prop)
			if descriptor then return descriptor
			context = Object.getPrototypeOf(context)
		return null



