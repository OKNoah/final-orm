import THREE from '../../vendor/three.min'


export default class MyMesh extends THREE.Mesh {

	constructor(geometry, material, roulette) {
		super(geometry, material)
		this.roulette = roulette
	}


	on(eventType, handler) {
		this.roulette.addMeshHandler(this, eventType, handler)
	}

}




