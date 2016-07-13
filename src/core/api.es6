import server from './server'
import EventEmitter from 'ui-js/core/event-emitter'


/******************** API **************************/
export default class API {

	static server = server

	static call(method, params) {
		return this.server.call(`${this.name}.${method}`, params)
	}

}


/******************** ListAPI **********************/
export class ListAPI extends API {

	static _getRanges() {
		if (!this._lists) {
			this._lists = []
		}
		return this._lists
	}


	static _updateRanges() {
		let lists = this._getRanges()
		for (let list of lists) {
			list.update()
		}
	}


	static list(filter, skip, limit) {
		let lists = this._getRanges()
		let list = new List(this, filter, skip, limit)
		lists.push(list)
		return list
	}


	static async add(data) {
		let res = this.call('add', data)
		this._updateRanges()
		return res
	}

}


/******************** List **********************/

function SuperArray() {

}

SuperArray.prototype = Array.prototype


class List extends SuperArray {

	constructor(Api, filter = {}, skip = 0, limit = 100) {
		super()
		this.eventEmitter = new EventEmitter()
		this.filter = filter
		this.limit = limit
		this.skip = skip
		this.Api = Api
		this.update()
	}


	on(...args) {
		return this.eventEmitter.on(...args)
	}


	off(...args) {
		return this.eventEmitter.off(...args)
	}


	emit(...args) {
		return this.eventEmitter.emit(...args)
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
		this.splice(0, this.length, ...res)
		this.emit('update', this)
	}


}

