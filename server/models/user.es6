import Model from '../lib/model'


class Sector extends Model {

	static schema = {
		size: Number
	}

}


class User extends Model {

	static schema = {
		name: {$type: String, test: /^\W+$/},
		age: {$type: Number, min: 0, max: 200},
		names: [{name: String}]
	}

}


(async function () {

	try {

		let user = await User.add({
			name: 'Ашот',
			age: 3,
			names: 3
		})


	} catch (e) {
		console.error(e)
	}


}())




