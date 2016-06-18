module.exports = class Vector

	toDeg = (rad)-> rad * (180 / Math.PI)
	toRad = (deg)-> deg * (Math.PI / 180)


	Vector.create = (event)->
		target = event.target
		rect = target.rect()
		x = target.toEm(event.clientX - rect.left)
		y = target.toEm(event.clientY - rect.top)
		return new Vector(x, y)


	constructor: (@x = 0, @y = 0)->
		return


	set: (vector)->
		if arguments.length is 2
			@x = arguments[0]
			@y = arguments[1]
			return
			
		@x = vector.x or 0
		@y = vector.y or 0
		return


	clone: ->
		return new Vector(@x, @y)


	distance: (vector)->
		return Math.sqrt(Math.pow(vector.x - @x, 2) + Math.pow(vector.y - @y, 2))


	pointInSegment: (vector, distance)->
		if distance is 0 then return @clone()
		q = @distance(vector) / distance
		x = ((vector.x - @x) + q * @x) / q
		y = ((vector.y - @y) + q * @y) / q
		return new Vector(x, y)


	angle: (vector)->
		catX = vector.x - @x
		catY = vector.y - @y
		rad = Math.atan(catY / catX)
		deg = toDeg(rad)
		if catX < 0 then deg -= 180
		deg += 90
		return deg


	byAngle: (deg, distance)->
		deg -= 90
		rad = toRad(deg)
		x = @x + distance * Math.cos(rad)
		y = @y + distance * Math.sin(rad)
		return new Vector(x, y)


	sum: (vector)->
		x = @x + vector.x
		y = @y + vector.y
		return new Vector(x, y)

