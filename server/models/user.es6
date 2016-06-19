import Model from '../lib/model'


class Sector extends Model {

	static schema = {
		size: Number
	}

}


class User extends Model {

	static schema = {
		name: String,
		name: {$type: String}
	}

}


(async function () {

	try {

		let user = await User.add({
			name: 'Ашот',
			status: 'active',
			classes: new Set(['Трис']),
		})

		user.classes.add('Двас')
		user.classes.add('Двас')
		user.classes.add('Двас')
		await user.save()
		await user.update()
		console.log(user.classes)

	} catch (e) {
		console.error(e)
	}


}())




