import THREE from 'three'
import Mesh from '../core/mesh'
import Loader from '../core/loader'


export default class SectorModel extends Mesh {


	constructor(renderRoot, textureUrl, rouletteRadius, rouletteHeight, angle, offset) {
		let thetaAngle = angle * Math.PI / 180
		let segments = Math.ceil(angle / (360 / 100))
		let color = Math.random() * 0xffffff

		let geometry = new THREE.CylinderGeometry(rouletteRadius, rouletteRadius + 20, rouletteHeight, segments, 1, false, 0, thetaAngle)
		let material = new THREE.MeshPhongMaterial({shininess: 40, color: color})

		super(renderRoot, geometry, material)

		this.position.y = rouletteHeight
		this.rotation.y = offset * Math.PI / 180

		this._text = new TextModel(renderRoot, rouletteRadius, rouletteHeight, Math.round(Math.random() * 100))
		this.add(this._text)
	}


	setText(text) {
		this._text.setText(text)
	}


}


class TextModel extends Mesh {

	constructor(renderRoot, rouletteRadius, rouletteHeight, text) {
		let canvas = document.createElement('canvas')
		let texture = new THREE.Texture(canvas)

		// canvas.classList.add('canvas')
		// document.body.appendChild(canvas)

		let geometry = new THREE.PlaneGeometry(500, 500, 1, 1)
		let material = new THREE.MeshPhongMaterial({shininess: 40, map: texture, transparent: true})

		super(renderRoot, geometry, material)

		this.position.x = rouletteRadius - 250
		this.position.y = rouletteHeight

		this.rotation.x = -90 * (Math.PI / 180)
		this.rotation.z = 90 * (Math.PI / 180)

		this._texture = texture
		this._canvas = canvas
		this.setText(text)
	}


	setText(text) {
		let size = 100
		let color = 0xff0000
		let context = this._canvas.getContext('2d')
		context.font = size + 'pt Arial'

		let textWidth = context.measureText(text).width

		this._canvas.width = textWidth
		this._canvas.height = textWidth

		context.font = size + 'pt Arial'

		context.textAlign = 'center'
		context.textBaseline = 'middle'
		context.fillStyle = color

		context.fillText(text, this._canvas.width / 2, this._canvas.height / 2)
		this._texture.needsUpdate = true
	}

}

