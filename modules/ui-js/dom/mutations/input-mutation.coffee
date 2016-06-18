ElementMutation = require('./element-mutation') 


module.exports = class InputMutation extends ElementMutation


	constructor: ->
		super
		@valueChanged = false
		@wasReset = false
		return


	changeValue: ->
		@valueChanged = true
		@wasReset = false
		return


	needReset: ->
		@wasReset = true
		@valueChanged = false
		return

