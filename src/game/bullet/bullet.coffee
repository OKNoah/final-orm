Dummy = require '.././dummy/dummy'


module.exports = class Bullet extends Dummy

	@styles: Dummy.styles.concat [require('./bullet.styl')]
	@selector: 'bullet'
	@template: ""


	constructor: ->
		@width = 0.7
		@height = 0.7
		super(-@width, -@height, @width, @height)
		@center.y = @height
		@center.x = @width / 2

		@data = null
		@target = null
		@movingSpeed = 12

		@watch 'target', => @start()
		@watch 'data.active', (state)=>
			if state then @start()
			else @stop()
			return
		return



	start: ->
		@position.set(@data.position)
		@angle = @data.angle
		@moveByAngle()
		return


	stop: ->
		@stopMove()
		return


	update: ->
		super

		unless @hasCollision(@app)
			@emit('out-of-world')
			return

		if @target and @hasCollision(@target)
			@host.addClass('__hit')
			@emit('hit-the-target')
			return
		return




