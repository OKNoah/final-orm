Text = require('../text/text')


module.exports = class Phone extends Text

	@selector: 'phone'

	test: (value)->
		numbers = value.match /\d/img
		return numbers?.length >= 10

    

