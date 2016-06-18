module.exports = class Event 


	Event.target = null


	constructor: (@name, @src, @target, realTarget, @realEvent)->
		@clientX = @realEvent.clientX
		@clientY = @realEvent.clientY

		relative = @relative(@target)
		@layerX = relative.x
		@layerY = relative.y

		@own = @src is @target
		@prevented = off
		@stopped = off
		return


	relative: (element)->
		rect = element.rect()
		x = @clientX - rect.left
		y = @clientY - rect.top
		return {x, y}


	emit: (handler)->
		Event.target = @target
		@target.emit(@name, @)
		Event.target = null
		return


	prevent: ->
		@prevented = yes
		@realEvent.preventDefault()
		return


	stop: ->
		@stopped = yes
		@realEvent.stopPropagation()
		return

		
