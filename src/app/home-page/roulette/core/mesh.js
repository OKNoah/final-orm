import THREE from 'three'


export default class MyMesh extends THREE.Mesh {

	constructor(renderRoot, geometry, material) {
		super(geometry, material)
		this._renderRoot = renderRoot
	}


	on(eventType, handler) {
		this._renderRoot.addMeshEventHandler(this, eventType, handler)
	}

}


