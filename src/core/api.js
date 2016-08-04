import server from './server'
import EventEmitter from 'ui-js/core/event-emitter'


/******************** API **************************/
export default class API {

	static server = server
	static api = ''

	static call(method, params) {
		return this.server.call(`${this.api}.${method}`, params)
	}

}


/******************** RangeAPI **********************/
export class RangeAPI extends API {

	static _getRanges() {
		if (!this._ranges) {
			this._ranges = []
		}
		return this._ranges
	}


	static _updateRanges() {
		let ranges = this._getRanges()
		for (let range of ranges) {
			range.update()
		}
	}


	static range(filter, skip, limit) {
		let ranges = this._getRanges()
		let range = new Range(this, filter, skip, limit)
		ranges.push(range)
		return range
	}


	static async add(data) {
		let res = this.call('add', data)
		this._updateRanges()
		return res
	}

}


/******************** Range **********************/

function SuperArray() {

}

SuperArray.prototype = Array.prototype


class Range extends SuperArray {

	constructor(Api, filter = {}, skip = 0, limit = 100) {
		super()
		this._eventEmitter = new EventEmitter()
		this.filter = filter
		this.limit = limit
		this.skip = skip
		this._api = Api
		this.update()
	}


	on(...args) {
		return this._eventEmitter.on(...args)
	}


	off(...args) {
		return this._eventEmitter.off(...args)
	}


	emit(...args) {
		return this._eventEmitter.emit(...args)
	}


	call(...args) {
		return this._api.call(...args)
	}


	async update() {
		let res = await this.call('get', {
			filter: this.filter,
			skip: this.skip,
			limit: this.limit,
		})
		this.splice(0, this.length, ...res)
		this.emit('update', this)
	}


}

