import Server from '../core/server'
import Sector from '../models/sector'
import API from '../core/api'


Server.api('Sector', class extends API {


	async get(params, connection) {
		console.log('sector.get', params, connection, this)

		let filter = params.get('filter', Object)
		let limit = params.get('limit', Number, {min: 1, max: 100})
		let skip = params.get('skip', Number, {min: 0})
		return await Sector.find(filter, skip, limit)
	}


})

