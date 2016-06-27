import Model from '../core/model'
import Utils from '../core/utils'


export default class User extends Model {

	static schema = {
		name: String,
		age: Number,
	}


	async startSession() {
		let key = Utils.createRandomString(64)
		return await Session.add({key: key, user: this})
	}


	static async getBySessionKey(key) {
		let session = await Session.findOne({key: key})
		if (!session) return null
		return await session.user
	}

}


class Session extends Model {

	static schema = {
		key: {$type: String, $index: true, $unique: true},
		user: User,
	}

}

//
// (async function () {
// 	try {
//
// 		let user = await User.add({name: 'Ашот', age: 3333})
//
// 		let users = await User.have({name: 'Ашот'})
// 		console.log(users)
//
// 	} catch (e) {
// 		console.error(e)
// 	}
// })()



