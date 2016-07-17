import Server from '../core/server'
import Sector from '../models/sector'
import {ListAPI} from '../core/api'


Server.api('Sector', class extends ListAPI {

	static model = Sector

	async add(params) {
		let name = params.get('name', String, {min: 1})
		let contentBg = params.get('contentBg')
		let bg = params.get('bg')

		return await Sector.add({name, bg, contentBg})
	}

})

