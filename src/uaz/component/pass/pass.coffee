Text = require('../text/text')


module.exports = class Pass extends Text

	@selector: 'pass'

	constructor: ->
		super
		@type = 'password'
		@length = 6
		return

	test: (value)->
		return value.length >= @length


