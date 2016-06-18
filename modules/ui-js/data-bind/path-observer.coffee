PropObserver = require('./prop-observer') 
Exp = require('./exp')

equals = (a, b)->
	if (a isnt a) and (b isnt b) # NaN
		return true
	return a is b


module.exports = class PathObserver

	constructor: (@context, path, @handler, @rootContext = @context)->
		if @context isnt Object(@context) then return
		@destroyed = false
		@path = path.slice()
		@accessor = @path.shift()
		@accessorObserver = null
		@subPathObserver = null

		unless @path.length
			@observeAccessor(@handler)
		else
			@initSubPathObserver()
			@observeAccessor (newSubContext)=>
				@updateSubPathObserver(newSubContext)
		return


	observeAccessor: (handler)->
		@accessorObserver = switch @accessor.type
			when 'prop' then @createPropObserver(handler)
			when 'exp' then @createExpPropObserver(handler)
			when 'call' then @createCallPropObserver(handler)
		return


	createPropObserver: (handler)->
		name = @accessor.name.toString()
		return new PropObserver(@context, name, handler)


	createExpPropObserver: (handler)->
		return new ExpPropObserver(@rootContext, @context, @accessor, handler)


	createCallPropObserver: (handler)->
		return new CallPropObserver(@rootContext, @context, @accessor, handler)


	initSubPathObserver: ->
		subContext = @getByAccessor(@context, @accessor)
		@subPathObserver = new PathObserver(subContext, @path, @handler, @rootContext)
		@value = @getByPath(subContext, @path)
		return


	updateSubPathObserver: (newSubContext)->
		@subPathObserver.destroy()
		@subPathObserver = new PathObserver(newSubContext, @path, @handler, @rootContext)
		oldValue = @value
		@value = @getByPath(newSubContext, @path)
		unless equals(@value, oldValue) then @handler(@value)
		return


	destroy: ->
		if @destroyed then return
		@subPathObserver?.destroy()
		@accessorObserver?.destroy()
		@destroyed = true
		return


	getByAccessor: (context, accessor)->
		switch accessor.type
			when 'prop'
				return context[accessor.name]
			when 'exp'
				return ExpPropObserver.getValue(@rootContext, context, accessor)
			when 'call'
				return CallPropObserver.getValue(@rootContext, context, accessor)
		return


	getByPath: (context, path)->
		for accessor in path
			unless context? then return undefined
			context = @getByAccessor(context, accessor)
		return context


####################################
# ExpPropObserver
####################################
class ExpPropObserver


	@getValue: (rootContext, context, accessor)->
		exp = new Exp(accessor.exp.code)
		key = exp(rootContext)
		return context[key]


	constructor: (rootContext, context, accessor, handler)->
		ExpObserver = require('./exp-observer')

		@destroyed = false
		@oldValue = undefined
		@propObserver = null

		exp = accessor.exp.code
		@expObserver = new ExpObserver rootContext, exp, (expValue)=>
			@propObserver?.destroy()

			@propObserver = new PropObserver context, expValue, (value)=>
				unless equals(value, @oldValue)
					@oldValue = value
					handler(value)
			, on

		, null, on
		return


	destroy: ->
		if @destroyed then return
		@propObserver?.destroy()
		@expObserver.destroy()
		@destroyed = true
		return


####################################
# CallPropObserver
####################################
class CallPropObserver


	@getValue: (rootContext, context, accessor)->
		name = accessor.name.toString()
		argsExp = new Exp("[#{accessor.exp.code}]")
		args = argsExp(rootContext)
		return context[name].apply(context, args)


	constructor: (@rootContext, @context, @accessor, @handler)->
		ExpObserver = require('./exp-observer')

		@destroyed = false
		@oldValue = undefined
		name = @accessor.name.toString()
		@funcObserver = new PropObserver(@context, name, @change)
		argsExp = "[#{@accessor.exp.code}]"
		@argsObserver = new ExpObserver(@rootContext, argsExp, @change)
		return


	change: =>
		value = CallPropObserver.getValue(@rootContext, @context, @accessor)
		unless equals(value, @oldValue)
			@oldValue = value
			@handler(value)
		return


	destroy: ->
		if @destroyed then return
		@funcObserver.destroy()
		@argsObserver.destroy()
		@destroyed = true
		return


