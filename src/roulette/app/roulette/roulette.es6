import THREE from '../../vendor/three.min'
import BezierEasing from 'bezier-easing'
import Draggable from 'ui-js/directives/draggable'
import turnSoundUrl from './turn.mp3'
// import Sectors from '../../list/sectors'
import MyMesh from './my-mesh'

window.THREE = THREE


export default class Roulette {

	static styles = [require('./roulette.styl')]
	static selector = 'roulette'

	static template = `
		<div .controls>
			<button (click)='run()'>Крутить рулетку</button>
		</div>
	`


	constructor() {
		this.easing = new BezierEasing(0.24, 0, 0.27, 0.99)
		this.fov = 90
		this.speed = 0
		this.angle = 0
		this.oldAngle = 0
		this.sectors = []
		this.roulette = null
		this.rouletteRadius = 1700

		//	render
		this.scene = null
		this.camera = null
		this.renderer = null
		this.loader = new THREE.TextureLoader()

		// events
		// TODO сделать очистку мусора
		this.raycaster = new THREE.Raycaster()
		this.eventHandlers3d = {}

		// init
		this.initPromise = this.init()
		this.draggable = new Draggable(this.host)
		this.initHandlers()
	}


	initHandlers() {
		ui.on('resize', ()=> this.initPromise.then(()=> this.updateMetric()))
		this.on('drag', (event)=> this.rotate(this.angle + (event.moveX / 4)))
		// this.sectors.on('update', this.onUpdateSectors.bind(this))
		this.initMeshHandlers()
	}


	async init() {
		await this.initComponent()
		await this.initRenderer()
		await this.initGeometry()
		this.animate()
	}


	addMeshHandler(mesh, eventType, handler) {
		if (!this.eventHandlers3d[eventType]) {
			this.eventHandlers3d[eventType] = new Map()
		}

		var meshesHandlersMap = this.eventHandlers3d[eventType]
		if (!meshesHandlersMap.has(mesh)) meshesHandlersMap.set(mesh, [])

		let meshEventHandlers = meshesHandlersMap.get(mesh)
		meshEventHandlers.push(handler)
	}


	triggerMeshHandlers(eventType, event) {
		let meshesHandlersMap = this.eventHandlers3d[eventType]
		if (!meshesHandlersMap) return
		let meshes = []
		meshesHandlersMap.forEach((handlers, mesh)=> meshes.push(mesh))

		let mouse = new THREE.Vector2()
		mouse.x = ( event.layerX / this.renderer.domElement.width ) * 2 - 1
		mouse.y = -( event.layerY / this.renderer.domElement.height ) * 2 + 1
		this.raycaster.setFromCamera(mouse, this.camera)
		let intersects = this.raycaster.intersectObjects(meshes, true)

		intersects.forEach(intersect => {
			let mesh = intersect.object
			if (meshes.indexOf(mesh) === -1) return
			let meshEventHandlers = meshesHandlersMap.get(mesh)
			meshEventHandlers.forEach(handler => handler(event, intersect))
		})
	}


	initMeshHandlers() {
		let lastLayerX = 0
		let lastLayerY = 0

		this.on('mousedown', event => {
			lastLayerX = event.layerX
			lastLayerY = event.layerY
			this.triggerMeshHandlers('mousedown', event)
		})

		this.on('mouseup', event => {
			this.triggerMeshHandlers('mouseup', event)
			if (Math.abs(event.layerX - lastLayerX) > 2) return
			if (Math.abs(event.layerY - lastLayerY) > 2) return
			this.triggerMeshHandlers('click', event)
		})

		this.on('mousemove', event=> this.triggerMeshHandlers('mousemove', event))
	}


	initComponent() {
		return new Promise(resolve => this.on('init', resolve))
	}


	initRenderer() {
		let width = this.host.width()
		let height = this.host.height()
		this.scene = new THREE.Scene()
		this.camera = this.createCamera(this.fov, width, height)
		this.renderer = this.createRenderer(width, height)
		this.host.realNode.appendChild(this.renderer.domElement)
	}


	initGeometry() {
		let light = new THREE.DirectionalLight(0xffffff, 1.5)
		light.position.y = 1000
		light.position.x = 600
		light.position.z = -800
		this.scene.add(light)

		let light2 = new THREE.DirectionalLight(0xffffff, 1)
		light2.position.y = -400
		light2.position.x = 400
		light2.position.z = 700
		this.scene.add(light2)

		let geometry = new THREE.CylinderGeometry(this.rouletteRadius, this.rouletteRadius, 1, 128)
		let material = new THREE.MeshPhongMaterial()

		material.shininess = 60
		this.roulette = new MyMesh(geometry, material, this)
		this.roulette.position.y = -200
		this.scene.add(this.roulette)
	}


	onUpdateSectors() {
		this.clearSectors()
		let width = 360 / this.sectors.length
		let height = this.rouletteRadius

		this.sectors.forEach((sector, index)=> {
			let angle = width * index
			let textureUrl = `storage/${sector.texture}`
			let sectorMesh = this.createSector(textureUrl, width, height, angle)
			this.roulette.add(sectorMesh)
			sectorMesh.on('click', ()=> this.emit('sectorclick', sector))
		})
	}


	clearSectors() {
		let children = this.roulette.children.slice()
		children.forEach(sectorMesh => this.roulette.remove(sectorMesh))
	}


	createSector(textureUrl, width, height, angle) {
		let thetaAngle = width * Math.PI / 180
		let segments = Math.ceil(width / (360 / 100))

		let geometry = new THREE.CylinderGeometry(height, height + 15, 100, segments, 1, false, 0, thetaAngle)

		let material = new THREE.MeshPhongMaterial() // {color: Math.random() * 0xffffff}
		material.shininess = 40

		let mesh = new MyMesh(geometry, material, this)
		mesh.position.y = 100
		mesh.rotation.y = angle * Math.PI / 180

		let paneGeometry = new THREE.CylinderGeometry(12, 12, 300, 40)
		let paneMaterial = new THREE.MeshPhongMaterial({color: 0xffffff})
		paneMaterial.shininess = 150
		let paneMesh = new MyMesh(paneGeometry, paneMaterial, this)
		paneMesh.position.x = -height + 30
		mesh.add(paneMesh)

		this.loader.load(textureUrl, texture => {
			mesh.material.map = texture
			mesh.material.bumpMap = texture
			mesh.material.bumpScale = 4
			mesh.material.needsUpdate = true
		})

		return mesh
	}


	createRenderer(width, height) {
		let renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
		renderer.setSize(width, height)
		return renderer
	}


	createCamera(fov, width, height) {
		let camera = new THREE.PerspectiveCamera(fov, width / height, 1, 10000)
		camera.position.z = 1700
		camera.position.y = 800
		camera.lookAt(new THREE.Vector3(0, -1500, 0))
		return camera
	}


	updateMetric() {
		let width = this.host.width()
		let height = this.host.height()
		this.camera.fov = this.fov
		this.camera.aspect = width / height
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(width, height)
	}


	run(angle = this.angle - 8290, time = 30000) {
		this.app.call()
		this.runned = true
		this.startTime = Date.now()
		this.endTime = this.startTime + time
		this.startAngle = this.angle
		this.endAngle = angle
	}


	rotateToSector(sector) {
		let index = this.sectors.indexOf(sector)
		let sectorWidth = 360 / this.sectors.length
		let sectorAngle = (sectorWidth * -index) - (sectorWidth / 2)
		this.run(sectorAngle, 1000)
	}


	animate() {
		ui.frame(this.animate.bind(this))
		this.calcRunAnimation()
		this.calcSounds()
		this.render()
	}


	calcRunAnimation() {
		if (!this.runned) return
		let currentTime = Date.now() - this.startTime
		let duration = this.endTime - this.startTime
		let delta = currentTime / duration
		delta = this.easing(delta)
		let angle = this.startAngle + ((this.endAngle - this.startAngle) * delta)
		this.rotate(angle)
		if (currentTime > duration) this.runned = false
	}


	calcSounds() {
		let sectorWidth = 360 / this.sectors.length
		let completedSectorsOldFrame = Math.floor(this.oldAngle / sectorWidth)
		let completedSectorsNewFrame = Math.floor(this.angle / sectorWidth)
		this.oldAngle = this.angle
		if (completedSectorsOldFrame !== completedSectorsNewFrame) {
			this.app.playSound(turnSoundUrl, 0.2)
		}
	}


	render() {
		this.renderer.render(this.scene, this.camera)
	}


	rotate(angle) {
		this.angle = angle
		this.roulette.rotation.y = this.angle * Math.PI / 180
	}

}


