import THREE from 'three'
import Mesh from '../core/mesh'


export default class RouletteModel extends Mesh {

	constructor(renderRoot, radius, height, x = 0, y = 0, z = 0) {
		let geometry = new THREE.CylinderGeometry(0, 0, 0, 0)
		let material = new THREE.MeshPhongMaterial({shininess: 60})

		super(renderRoot, geometry, material)
		this.position.set(x, y, z)

		this._centralCircle = new CentralCircleModel(renderRoot, radius, height)
		this.add(this._centralCircle)
	}

}


class CentralCircleModel extends Mesh {

	constructor(renderRoot, rouletteRadius, rouletteHeight) {
		let radius = rouletteRadius / 100 * 65
		let height = 30

		let geometry = new THREE.CylinderGeometry(radius, radius, height, 128)
		let material = new THREE.MeshPhongMaterial({shininess: 100, color: 0xbbbbbb})
		super(renderRoot, geometry, material)

		this.position.y = rouletteHeight + height + (height / 2)
	}

}

