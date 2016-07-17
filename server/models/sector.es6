import Model from '../core/model'
import Utils from '../core/utils'


export default class Sector extends Model {

	static schema = {
		name: String,
		bg: String,
		contentBg: String,
	}


	static async add({name, bg, contentBg}) {
		bg = await Utils.saveImage(bg, 'jpg')
		contentBg = await Utils.saveImage(contentBg, 'jpg')
		return super.add({name, bg, contentBg})
	}


}

