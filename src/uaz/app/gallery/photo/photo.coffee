module.exports = class Photo

	@styles: [require('./photo.styl')]
	@selector: 'photo'
	@template: "
		<div .move-wrapper #moveWrapper .__dragging='dragging'
		[style.transform]='translate({{x}}px, {{y}}px)'>

			<div .zoom-wrapper
			[style.transform]='scale({{zoom}})'>

				<img .img #img *draggable
				(wheel)='onWheel($event)'
				(drag)='drag($event)'
				(drag-start)='dragStart()'
				(drag-end)='dragEnd()'
				(mousedown)='onMouseDown($event)'
				(mouseup)='onMouseUp($event)'
				[src]='src'>
				</img>

			</div>
		</div>
	"

	constructor: ->
		@x = 0
		@y = 0
		@src = ''
		@zoom = 1
		@minZoom = 0.5
		@maxZoom = 20
		@zoomStep = 0.25
		@dragging = off
		@state = off
		@bindClass('__dragging', 'dragging')
		@initHandlers()
		return


	initHandlers: ->
		@on('click', @onClick)
		ui.keyboard.on 'up', => @zoomIn() if @state
		ui.keyboard.on 'down', => @zoomOut() if @state
		ui.keyboard.on 'space', => @reset() if @state
		return


	onClick: (event)=>
		if event.src isnt @locals.img
			@emit('exit')
		return


	onMouseDown: (event)->
		@clientX = event.clientX
		@clientY = event.clientY
		return


	onMouseUp: (event)->
		if @clientX isnt event.clientX then return
		if @clientY isnt event.clientY then return
		@reset()
		return


	dragStart: ->
		@dragging = on
		return


	dragEnd: ->
		@dragging = off
		return


	drag: (event)->
		@x += event.moveX
		@y += event.moveY
		return


	onWheel: (event)=>
		toUp = event.realEvent.deltaY < 0
		if toUp then @zoomIn(event)
		else @zoomOut(event)
		return


	zoomIn: (event)->
		@setZoom(@zoom + @zoom * @zoomStep, event)
		return


	zoomOut: (event)->
		@setZoom(@zoom - @zoom * @zoomStep, event)
		return


	setZoom: (zoom, event)->
		oldZoom = @zoom
		newZoom = Math.max(Math.min(zoom, @maxZoom), @minZoom)

		rect = @host.rect()
		width = rect.width
		height = rect.height

		if event
			point = event.relative(@host)
			x = (point.x - @x) / (width * oldZoom)
			y = (point.y - @y) / (height * oldZoom)
		else
			x = ((width / 2) - @x) / (width * oldZoom)
			y = ((height / 2) - @y) / (height * oldZoom)

		x = Math.max(Math.min(x, 1), 0)
		y = Math.max(Math.min(y, 1), 0)

		widthDiff = (width * newZoom) - (width * oldZoom)
		heightDiff = (height * newZoom) - (height * oldZoom)
		@x -= widthDiff * x
		@y -= heightDiff * y

		@zoom = newZoom
		return


	setPosition: (point)->
		@x = point.x
		@y = point.y
		return


	reset: ->
		@setZoom(1)
		@x = 0
		@y = 0
		return

