export default class Photo {

	static styles = [require('./photo.styl')]
	static selector = 'photo'
	static template = `
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
	`

	constructor() {
		this.x = 0
		this.y = 0
		this.src = ''
		this.zoom = 1
		this.minZoom = 0.5
		this.maxZoom = 20
		this.zoomStep = 0.25
		this.dragging = false
		this.state = false
		this.bindClass('__dragging', 'dragging')
		this.initHandlers()
	}


	initHandlers() {
		this.on('click', this.onClick)
		ui.keyboard.on('up', ()=> this.state && this.zoomIn())
		ui.keyboard.on('down', ()=> this.state && this.zoomOut())
		ui.keyboard.on('space', ()=> this.state && this.reset())
	}


	onClick(event) {
		if (event.src !== this.locals.img) {
			this.emit('exit')
		}
	}


	onMouseDown(event) {
		this.clientX = event.clientX
		this.clientY = event.clientY
	}


	onMouseUp(event) {
		if (this.clientX !== event.clientX) return
		if (this.clientY !== event.clientY) return
		this.reset()
	}


	dragStart() {
		this.dragging = true
	}


	dragEnd() {
		this.dragging = false
	}


	drag(event) {
		this.x += event.moveX
		this.y += event.moveY
	}


	onWheel(event) {
		let toUp = event.realEvent.deltaY < 0
		if (toUp) this.zoomIn(event)
		else this.zoomOut(event)
	}


	zoomIn(event) {
		this.setZoom(this.zoom + this.zoom * this.zoomStep, event)
	}


	zoomOut(event) {
		this.setZoom(this.zoom - this.zoom * this.zoomStep, event)
	}


	setZoom(zoom, event) {
		let oldZoom = this.zoom
		let newZoom = Math.max(Math.min(zoom, this.maxZoom), this.minZoom)

		let rect = this.host.rect()
		let width = rect.width
		let height = rect.height

		if (event) {
			let point = event.relative(this.host)
			var x = (point.x - this.x) / (width * oldZoom)
			var y = (point.y - this.y) / (height * oldZoom)
		}
		else {
			var x = ((width / 2) - this.x) / (width * oldZoom)
			var y = ((height / 2) - this.y) / (height * oldZoom)
		}

		x = Math.max(Math.min(x, 1), 0)
		y = Math.max(Math.min(y, 1), 0)

		let widthDiff = (width * newZoom) - (width * oldZoom)
		let heightDiff = (height * newZoom) - (height * oldZoom)
		this.x -= widthDiff * x
		this.y -= heightDiff * y

		this.zoom = newZoom
	}


	setPosition(point) {
		this.x = point.x
		this.y = point.y
	}


	reset() {
		this.setZoom(1)
		this.x = 0
		this.y = 0
	}

}

