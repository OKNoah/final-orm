ExpObserver = require('./exp-observer') 
Exp = require('./exp')


module.exports = class DataBind

	constructor: (objL, expL, objR, expR, scope)->
		@destroyed = false

		expL = new Exp(expL)
		expR = new Exp(expR)

		if not expL.set
			throw Error 'Invalid left-hand expression in DataBind'

		value = expR(objR, scope) ? expL(objL, scope)

		expL.set(objL, value)
		expR.set?(objR, value, scope)

		@observerR = new ExpObserver objR, expR, (value)->
			expL.set(objL, value)
		, scope

		@observerL = new ExpObserver objL, expL, (value)->
			if expR.set
				expR.set(objR, value, scope)
			else
				value = expR(objR)
				expL.set(objL, value)
		return


	destroy: ->
		if @destroyed then return
		@observerL?.destroy()
		@observerR?.destroy()
		@destroyed = true
		return
		
		