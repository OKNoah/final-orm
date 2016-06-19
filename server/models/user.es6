import Model from '../lib/model'


class Sector extends Model {

	static schema = {
		size: Number
	}

}


class User extends Model {

	static schema = {
		name: String,
		status: {$type: String, emun: ['Рас', 'Двас', 'Трис']},
		// statuses: {$type: Set, set: ['1', 3, '5']}
	}

}




(async function () {

	try {

		let user = await User.add({
			name: 'Ашот',
			age: 3,
			names: [{name: 100}]
		})

	} catch (e) {
		console.error(e)
	}


}())




