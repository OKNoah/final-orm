import Model from '../lib/model'


class Sector extends Model {

	static schema = {
		size: Number
	}

}


class User extends Model {

	static schema = {
		name: String,
		status: {$type: String, enum: ['active', 'desctive', 'done']},
		classes: {$type: Set, set: ['Рас', 'Двас', 'Трис']},
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




