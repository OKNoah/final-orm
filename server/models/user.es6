import Model from '../lib/model'


class Sector extends Model {

	static schema = {
		size: Number
	}

}


class User extends Model {

	static schema = {
		name: String,
		sectors: [Sector]
	}

}


(async function () {

	try {

		let sector = await Sector.add({
			size: 236,
		})
		let sector2 = await Sector.add({
			size: 1005,
		})

		let user = await User.add({
			name: 'Ашот',
			sectors: [sector]
		})

		let sectors = await user.sectors
		user.sectors = [sector, sector, sector]

		await user.save()
		console.log(await user.sectors)


	} catch (e) {
		console.error(e)
	}

}())






