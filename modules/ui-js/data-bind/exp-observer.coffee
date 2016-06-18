PathObserver = require('./path-observer') 
Exp = require('./exp')


module.exports = class ExpObserver


	constructor: (@context, @exp, @handler, @locals = null, init = off)->
		@exp = new Exp(@exp)

		@destroyed = false
		@observers = []
		@value = undefined

		for path in @exp.paths
			@observers.push(@createObserver(@context, path))
			if @locals then @observers.push(@createObserver(@locals, path))

		if init then @handler(@getValue())
		return


	getValue: ->
		return @exp(@context, @locals)


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

