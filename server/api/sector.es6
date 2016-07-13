import Server from '../core/server'
import Sector from '../models/sector'
import {ListAPI} from '../core/api'


Server.api('Sector', class extends ListAPI {

	static model = Sector

	async add(params) {
		let name = params.get('name', String, {min: 1})
		let texture = params.get('texture')
		return await Sector.add({name, texture})
	}

})

