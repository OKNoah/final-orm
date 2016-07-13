export default class API extends null {


}


export class ListAPI extends API {

	static model = null

	async get(params) {
		let filter = params.get('filter', Object)
		let limit = params.get('limit', Number, {min: 1, max: 100})
		let skip = params.get('skip', Number, {min: 0})
		return await this.constructor.model.find(filter, skip, limit)
	}


	// async add(data) {
	// 	return await this.constructor.model.add(data)
	// }

}



