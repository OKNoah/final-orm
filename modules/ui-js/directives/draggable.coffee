module.exports = class Draggable
	

	@attribute: 'draggable'


	constructor: (@node)->
		@startX = 0
		@startY = 0
		@lastX = 0
		@lastY = 0
		@state = off
		@initHandlers()
		return


	initHandlers: ->
		@node.on('mousedown', @onMouseDown)
		ui.dom.on('mouseup', @onMouseUp)
		ui.dom.on('mousemove', @onMouseMove)
		return


	onMouseDown: (event)=>
		@state = on
		@startX = event.clientX
		@startY = event.clientY
		@lastX = 0
		@lastY = 0
		@node.emit('dragstart')
		event.prevent()
		return


	onMouseUp: (event)=>
		@state = off
		@node.emit('dragend')
		@node.emit('dragstop')
		return



	onMouseMove: (event)=>
		unless @state then return
		x = event.clientX - @startX
		y = event.clientY - @startY

		moveX = x - @lastX
		moveY = y - @lastY

		@lastX = x
		@lastY = y

		@node.emit('drag', {x, y, moveX, moveY})
		return


