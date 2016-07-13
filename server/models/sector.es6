import Model from '../core/model'
import Utils from '../core/utils'


export default class Sector extends Model {

	static schema = {
		name: String,
		texture: String,
	}


	static async add({name, texture}) {
		texture = await Utils.saveImage(texture, 'jpg')
		return super.add({name, texture})
	}


}

