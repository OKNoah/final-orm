import ui from 'ui-js'
import THREE from 'three'
import BezierEasing from 'bezier-easing'
import Draggable from 'ui-js/directives/draggable'
import turnSoundUrl from './turn.mp3'
import Audio from '../../../core/audio'
import RenderRoot from './core/render-root'
import LightModel from './models/light-model'
import RouletteModel from './models/roulette-model'
import SectorModel from './models/sector-model'


export default class Roulette extends RenderRoot {

	static tag = 'roulette'

	constructor() {
		super()

		this.easing = new BezierEasing(0.24, 0, 0.27, 0.99)
		this.draggable = new Draggable(this.host)

		this.fov = 70
		this.speed = 0
		this.angle = 0
		this.oldAngle = 0
		this.sectors = []

		this.radius = 1800
		this.height = 100

		this.lightModel = new LightModel(0xffffff, 1.5, 600, 1000, -800)
		this.scene.add(this.lightModel)

		this.light2Model = new LightModel(0xffffff, 1, 400, -400, 700)
		this.scene.add(this.light2Model)

		this.rouletteModel = new RouletteModel(this, this.radius, this.height, 0, -200)
		this.scene.add(this.rouletteModel)

		this.cameraView()
		this.initHandlers()
	}


	cameraView() {
		this.camera.position.set(0, 1300, 1900)
		this.camera.lookAt(new THREE.Vector3(0, -605, 486))
	}


	initHandlers() {
		ui.on('resize', ()=> {
			this.updateMetric()
		})

		this.on('drag', event => {
			this.rotate(this.angle + (event.moveX / 4))
		})

		this.on('init', () => {
			this.host.realNode.appendChild(this.renderer.domElement)
			this.updateMetric()
		})
	}


	destructor() {
		this.renderer.forceContextLoss()
		this.stopAnimate()
	}


	updateSectors(sectorsData) {
		sectorsData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7]
		// sectorsData = [1, 2, 3]

		let angle = 360 / sectorsData.length
		let radius = this.radius
		let height = this.height

		this.sectors = sectorsData.map((sectorData, index)=> {
			let offset = angle * index
			let textureUrl = `storage/${sectorData.texture}`
			return new SectorModel(this, textureUrl, radius, height, angle, offset)
			// sectorMesh.on('click', ()=> this.emit('sectorclick', sector))
		})

		for (let sector of this.sectors) {
			this.rouletteModel.add(sector)
		}
	}


	updateMetric() {
		let width = this.host.width()
		let height = this.host.height()
		this.camera.fov = this.fov
		this.camera.aspect = width / height
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(width, height)
	}


	run(angle = this.angle - 4290, time = 20000) {
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
			Audio.playSound(turnSoundUrl, 0.2)
		}
	}


	animate() {
		this.calcRunAnimation()
		this.calcSounds()
	}


	rotate(angle) {
		this.angle = angle
		this.rouletteModel.rotation.y = this.angle * Math.PI / 180
	}

}


