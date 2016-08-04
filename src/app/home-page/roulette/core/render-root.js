import ui from 'ui-js'
import THREE from 'three'


export default class RenderRoot {


	constructor() {
		// public
		this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
		this.camera = new THREE.PerspectiveCamera(0, 0, 1, 10000)
		this.scene = new THREE.Scene()

		this._raycaster = new THREE.Raycaster()
		this._eventHandlers = {}
		this._frameId = null

		this._initMeshHandlers()
		this.startAnimate()
	}


	startAnimate() {
		this._frameId = ui.frame(()=> {
			this.startAnimate()
			this.animate()
			this.render()
		})
	}


	stopAnimate() {
		ui.stopFrame(this._frameId)
	}


	animate() {
		console.warn('Virtual method')
	}


	render() {
		this.renderer.render(this.scene, this.camera)
	}


	addMeshEventHandler(mesh, eventType, handler) {
		if (!this._eventHandlers[eventType]) {
			this._eventHandlers[eventType] = new Map()
		}

		let meshesHandlersMap = this._eventHandlers[eventType]
		if (!meshesHandlersMap.has(mesh)) {
			meshesHandlersMap.set(mesh, [])
		}

		let meshEventHandlers = meshesHandlersMap.get(mesh)
		meshEventHandlers.push(handler)
	}


	_initMeshHandlers() {
		let step = 2
		let lastLayerX = 0
		let lastLayerY = 0
		let domElement = this.renderer.domElement

		domElement.addEventListener('mousedown', event => {
			let rect = domElement.getBoundingClientRect()
			lastLayerX = event.clientX - rect.left
			lastLayerY = event.clientY - rect.top
			this._triggerMeshHandlers('mousedown', event)
		})

		domElement.addEventListener('mouseup', event => {
			this._triggerMeshHandlers('mouseup', event)
			let rect = domElement.getBoundingClientRect()
			lastLayerX = event.clientX - rect.left
			lastLayerY = event.clientY - rect.top
			if (Math.abs(event.layerX - lastLayerX) > step) return
			if (Math.abs(event.layerY - lastLayerY) > step) return
			this._triggerMeshHandlers('click', event)
		})

		domElement.addEventListener('mousemove', event => {
			this._triggerMeshHandlers('mousemove', event)
		})
	}


	_triggerMeshHandlers(eventType, event) {
		let meshesHandlersMap = this._eventHandlers[eventType]
		if (!meshesHandlersMap) return

		let meshes = []
		meshesHandlersMap.forEach((handlers, mesh)=> {
			meshes.push(mesh)
		})

		let mouse = new THREE.Vector2()
		let width = this._renderer.domElement.width
		let height = this._renderer.domElement.height
		mouse.x = (event.layerX / width) * 2 - 1
		mouse.y = -(event.layerY / height) * 2 + 1

		this._raycaster.setFromCamera(mouse, this.camera)
		let intersects = this._raycaster.intersectObjects(meshes, true)

		intersects.forEach(intersect => {
			let mesh = intersect.object
			if (meshes.indexOf(mesh) === -1) return
			let meshEventHandlers = meshesHandlersMap.get(mesh)
			meshEventHandlers.forEach(handler => {
				handler(event, intersect)
			})
		})
	}

}


