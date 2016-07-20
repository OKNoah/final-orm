export default class Gallery {

	static style = require('./gallery.styl')
	static tag = 'gallery'
	static template = `
		
		<popup .popup #popup (close)="onPopupClose()">
		
			<div .photo .__dragging='dragging' 
			[style.transform]='translate({{x}}px, {{y}}px)'>
	
				<div .photo-zoom
				[style.transform]='scale({{zoom}})'>
	
					<img .img #img *draggable
					(wheel)='onWheel($event)'
					(drag)='drag($event)'
					(drag-start)='dragStart()'
					(drag-end)='dragEnd()'
					(mousedown)='onMouseDown($event)'
					(mouseup)='onMouseUp($event)'
					[src]='activeUrl'>
					</img>
	
				</div>
			</div>
			
		</popup>


		<div .panel *if='morOne' (wheel)='onPanelWheel($event)'>
			<ul .previews [style.transform]='translateX({{ -previewsX }}em)'>

				<li .preview
					*for='url, index in urls'
					[style.backgroundImage]='url({{ url }})'
					(click)='activateByIndex(index)'>
				</li>

			</ul>
		</div>
	`

	constructor() {
		this.urls = []
		this.morOne = false
		this.previewsX = 0

		this.x = 0
		this.y = 0
		this.zoom = 1
		this.activeUrl = ''

		this.minZoom = 0.5
		this.maxZoom = 20
		this.zoomStep = 0.25
		this.dragging = false

		this.active = false
		this.bind('active', 'locals.popup.active')
		this.bindClass('__active', 'locals.popup.active')

		this.initHandlers()
		this.activateByIndex(0)
	}


	initHandlers() {
		ui.keyboard.on('up', ()=> this.active && this.zoomIn())
		ui.keyboard.on('down', ()=> this.active && this.zoomOut())
		ui.keyboard.on('space', ()=> this.active && this.reset())

		ui.keyboard.on('left', ()=> this.prev())
		ui.keyboard.on('right', ()=> this.next())
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


	open(urls = []) {
		this.locals.popup.open()
		this.urls = urls
		this.morOne = urls.length > 0
		this.activateByIndex(0)
	}


	close() {
		this.locals.popup.close()
		this.reset()
	}


	onPopupClose() {
		this.reset()
	}


	onPanelWheel(event) {
		if (event.realEvent.deltaY > 0) this.next()
		else this.prev()
	}


	next() {
		let index = this.getActiveIndex()
		this.activateByIndex(index + 1)
	}


	prev() {
		let index = this.getActiveIndex()
		this.activateByIndex(index - 1)
	}


	getActiveIndex() {
		return this.urls.indexOf(this.activeUrl)
	}


	activateByIndex(index) {
		index = Math.max(Math.min(index, this.urls.length - 1), 0)
		this.activeUrl = this.urls[index]
		this.previewsX = index * 3.2
		this.reset()
	}


	reset() {
		// this.setZoom(1)
		this.zoom = 1
		this.x = 0
		this.y = 0

	}


}


