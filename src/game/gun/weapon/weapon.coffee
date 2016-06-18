Dummy = require('../../dummy/dummy')


module.exports = class Weapon extends Dummy

	@styles: Dummy.styles.concat [require('./weapon.styl')]
	@selector: 'weapon'

	constructor: ->
		super(0, 0.3, 1, 3)
		@rotateSpeed = 90
		@speed = 40

		@center.y = @height
		@center.x = @width / 2
		return




