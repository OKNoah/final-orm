import server from './server'


export default class API {

	static server = server

	static call(method, ...args) {
		return this.server.call(`${this.name}.${method}`, ...args)
	}

}


export class RangeAPI extends API {


	static range(filter, skip, limit) {
		return new Range(this, filter, skip, limit)
	}

}


function SuperArray() {

}

SuperArray.prototype = Array.prototype


class Range extends SuperArray {

	constructor(Api, filter = {}, skip = 0, limit = 100) {
		super()
		this.filter = filter
		this.limit = limit
		this.skip = skip
		this.Api = Api
		this.update()
	}


	call(...args) {
		return this.Api.call(...args)
	}


	async update() {
		let res = await this.call('get', {
			filter: this.filter,
			skip: this.skip,
			limit: this.limit,
		})

		console.log('update', res)
	}


}

