export default class API extends null {


}


export class ListApi extends API {

	static Model = null

	async get(params) {
		let filter = params.get('filter', Object)
		let limit = params.get('limit', Number, {min: 1, max: 100})
		let skip = params.get('skip', Number, {min: 0})
		return await this.constructor.Model.find(filter, skip, limit)
	}

}



