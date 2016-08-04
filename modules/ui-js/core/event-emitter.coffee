module.exports = class EventEmitter


	on: (type, handler)->
		allHandlers = @eventHandlers ?= {}
		handlers = allHandlers[type] or= []
		handlers.push(handler)
		return @


	one: (type, handler)->
		self = @
		wrapper = ->
			returns = handler.apply(@, arguments)
			self.off(type, wrapper)
			return returns
		@on(type, wrapper)
		return @


	off: (type, handler)->
		unless @eventHandlers then return
		allHandlers = @eventHandlers
		handlers = allHandlers[type]
		unless handlers then return
		unless handler then delete allHandlers[type]
		else
			handlers = handlers.filter (setHandler)->
				return setHandler isnt handler
			allHandlers[type] = handlers
		return @


	emit: (type, data)->
		unless @eventHandlers then return
		handlers = @eventHandlers[type]
		unless handlers then return
		for handler in handlers.slice()
			handler(data)
		return @


	hasEventHandlers: (type)->
		unless @eventHandlers?[type] then return false
		return @eventHandlers?[type].length > 0


	removeAllEventHandlers: ->
		delete @eventHandlers
		return

		
