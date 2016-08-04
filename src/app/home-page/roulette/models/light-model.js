import THREE from 'three'


export default class LightModel extends THREE.DirectionalLight {

	constructor(color = 0xffffff, intensity = 1, x = 0, y = 0, z = 0) {
		super(color, intensity)
		this.position.x = x
		this.position.y = y
		this.position.z = z
	}

}

