import passwordHash from 'password-hash'
import Model from '../core/model'
import Utils from '../core/utils'


export default class User extends Model {

	static schema = {
		login: {$type: String, $unique: true},
		pass: String,
	}


	static async getBySession(session) {
		if (!session) return null
		return await session.user
	}


	static add({login, pass}) {
		pass = passwordHash.generate(pass)
		return super.add({login, pass})
	}


	///////////////////////////////////////
	async startSession() {
		let key = Utils.createRandomString(64)
		return await Session.add({key: key, user: this})
	}


	checkPass(pass) {
		return passwordHash.verify(pass, this.pass)
	}

}


// class Session
export class Session extends Model {

	static schema = {
		key: {$type: String, $unique: true},
		user: User,
	}

	static async getByKey(key) {
		if (!key) return null
		return await this.findOne({key})
	}


	async close() {
		await this.remove()
	}

}



