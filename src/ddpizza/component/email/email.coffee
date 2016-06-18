Text = require('../text/text')

module.exports = class Email extends Text

	@selector: 'email'

	test: /^.+@.+$/im



