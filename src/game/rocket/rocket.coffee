Dummy = require('../dummy/dummy')
Vector = require('../core/vector')


module.exports = class Rocket extends Dummy

	@selector: 'rocket'
	@styles: Dummy.styles.concat [require('./rocket.styl')]
	@template: "
	"

	constructor: ->
		@width = 7
		@height = 2
		@offsetTop = 12

		@minSpeed = 500
		@maxSpeed = 1000
		@speedQ = @generateRandomSpeedQ()

		super(-@width, @offsetTop, @width, @height)
		@movingSpeed = 10
		@initHandlers()
		return


	initHandlers: ->
		@app.on 'resize', => @updateSpeed()
		return


	generateRandomSpeedQ: ->
		return Math.random() * (@maxSpeed - @minSpeed) + @minSpeed


	randomizeSpeedQ: ->
		@speedQ = @generateRandomSpeedQ()
		@updateSpeed()
		return


	updateSpeed: ->
		@movingSpeed = @speedQ / @app.height
		return


	start: ->
		@randomizeSpeedQ()
		@move new Vector(@app.width, @offsetTop), =>
			@reset()
			@start()
		return


	stop: ->
		@stopMove()
		return


	reset: ->
		@stopMove()
		@position.set(-@width, @offsetTop)
		return

	

