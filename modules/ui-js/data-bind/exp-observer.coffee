PathObserver = require('./path-observer') 
Exp = require('./exp')


module.exports = class ExpObserver


	constructor: (@context, @exp, @handler, @scope = null, init = off)->
		@exp = new Exp(@exp)

		@destroyed = false
		@observers = []
		@value = undefined

		for path in @exp.paths
			@observers.push(@createObserver(@context, path))
			if @scope then @observers.push(@createObserver(@scope, path))

		if init then @handler(@getValue())
		return


	getValue: ->
		return @exp(@context, @scope)


	createObserver: (context, path)->
		return new PathObserver context, path, =>
			oldValue = @value
			@value = @getValue()

			if (oldValue isnt oldValue) and (@value isnt @value)
				return # NaN is NaN

			if oldValue isnt @value
				@handler(@value)
			return


	destroy: ->
		if @destroyed then return
		for observer in @observers
			observer.destroy()
		@destroyed = true
		return

