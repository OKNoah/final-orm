Vector = require('../core/vector')


module.exports = class Dummy

	@styles: [require('./dummy.styl')]
	@selector: 'dummy'

	constructor: (x = 0, y = 0, @width = 2, @height = 2)->
		@parent = null
		@children = []

		@center = new Vector(0, 0)

		@position = new Vector(x, y)
		@movingSpeed = 20
		@movingStart = null
		@movingTarget = null
		@movingAutoStop = on
		@movingStartTime = null
		@movingMode = off

		@angle = 0
		@rotateSpeed = 20
		@rotateStart = null
		@rotateTarget = null
		@rotateStartTime = null
		@rotatingMode = off

		@render()
		return


	render: ->
		@update()
		@host.style.width = "#{@width}em"
		@host.style.height = "#{@height}em"
		@host.style.transform = "translate(#{@position.x - @center.x}em, #{@position.y - @center.y}em) rotateZ(#{@angle}deg) rotate3d(0,0,0,0)"
		@host.style.transformOrigin = "#{@center.x}em #{@center.y}em"
		ui.frame => @render()
		return


	absolute: ->
		context = @host
		x = @position.x
		y = @position.y
		while context = context.parent or context.host
			component = context.component
			if component
				x += component.position.x - component.center.x
				y += component.position.y - component.center.y

		return new Vector(x, y)


	rotate: (angle)->
		@updateRotate()
		@stopRotate()
		angle %= 180
		@rotateStart = @angle
		@rotateTarget = angle
		@rotateStartTime = Date.now()
		@rotatingMode = on
		#		totalAngle = @rotateTarget - @rotateStart
		#		if Math.abs(totalAngle) > 180
		#			console.log 'calc', @rotateTarget
		#		console.log totalAngle
		return


	rotateTo: (vector)->
		angle = @position.angle(vector)
		@rotate(angle)
		return


	stopRotate: ->
		@rotateStart = null
		@rotateTarget = null
		@rotateStartTime = null
		@rotatingMode = off
		return


	updateRotate: ->
		unless @rotatingMode then return
		diffTime = Date.now() - @rotateStartTime
		totalAngle = @rotateTarget - @rotateStart
		rotatingAngle = diffTime / 1000 * @rotateSpeed
		if totalAngle < 0 then rotatingAngle *= -1

		if Math.abs(rotatingAngle) < Math.abs(totalAngle)
			@angle = @rotateStart + rotatingAngle
			return

		@angle = @rotateTarget
		@stopRotate()
		return


	move: (vector, autoStop = on)->
		@updateMove()
		@stopMove()
		@movingStart = @position.clone()
		@movingTarget = vector.clone()
		@movingStartTime = Date.now()
		@movingAutoStop = autoStop
		@movingMode = on
		return


	stopMove: ->
		@movingStart = null
		@movingTarget = null
		@movingStartTime = null
		@movingMode = off
		return


	moveByAngle: (angle, distance)->
		unless angle?
			@updateRotate()
			angle = @angle

		unless distance?
			distance = 10
			autoStop = off

		vector = @position.byAngle(angle, distance)
		@move(vector, autoStop)
		return


	updateMove: ->
		unless @movingMode then return
		diffTime = Date.now() - @movingStartTime
		totalDistance = @movingStart.distance(@movingTarget)
		movingDistance = diffTime / 1000 * @movingSpeed

		if not @movingAutoStop or movingDistance < totalDistance
			@position.set @movingStart.pointInSegment(@movingTarget, movingDistance)
			return

		@position.set(@movingTarget)
		@stopMove()
		if typeof @movingAutoStop is 'function'
			@movingAutoStop()
		return


	update: ->
		@updateMove()
		@updateRotate()
		return


	mouse: (event)->
		return Vector.create(event)


	hasCollision: (dummy)->
		selfBox = @getBox()
		targetBox = dummy.getBox()

		if targetBox.bottom < selfBox.top then return false
		if targetBox.top > selfBox.bottom then return false
		if targetBox.left > selfBox.right then return false
		if targetBox.right < selfBox.left then return false
		return true


	getBox: ->
		position = @absolute()
		left = position.x
		top = position.y

		if @parent
			left -= @center.x
			top -= @center.y

		right = left + @width
		bottom = top + @height
		return {left, right, top, bottom}



