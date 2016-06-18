module.exports = class Pizza

	@styles: [require('./pizza.styl')]
	@selector: 'pizza'
	@template: "
			<div .pizza *draggable
				(drag)='drag($event)'
				(dragstart)='dragStart()'
				(dragstop)='dragStop()'
				[style.transform]='rotateX({{ -y / 4  }}deg) rotateZ({{ -x / 4 }}deg)'>

				<div .sprite
					*for='sprite in sprites'
					[style.top]='{{sprite.top}}em'
					[style.left]='{{sprite.left}}em'
					[style.width]='{{sprite.size}}em'
					[style.height]='{{sprite.size}}em'
					[style.transform]='translateZ({{sprite.z}}em) translate(-50%,-50%) rotateZ({{ sprite.angle }}deg)'>
				</div>

			</div>

	"

	constructor: ->
		@minAngle = 0
		@maxAngle = -160
		@x = 0
		@y = -140
		@sprites = []
		@dragging = off
		@createSprites()
		@autorotate()
		@constraint()
		return


	autorotate: ->
		unless @dragging then @x += 1
		ui.frame => @autorotate()
		return


	dragStart: ->
		@dragging = yes
		return


	dragStop: ->
		@dragging = off
		return


	drag: (event)->
		@x += event.moveX
		@y += event.moveY
		@constraint()
		return


	constraint: ->
		@y = Math.min(@minAngle, Math.max(@maxAngle, @y))
		return


	createSprites: (count = 10)->
		@sprites = for i in [0...count]
			@createSprite(i * 0.1)
		return


	createSprite: (z)->
		min = 4
		size = 20
		return {
			top: @random(min, size - min)
			left: @random(min, size - min)
			size: @random(4, 5)
			z: z
			angle: @random(-50, 50)
		}



	random: (min, max)->
		return Math.random() * (max - min) + min


