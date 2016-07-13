import Server from '../core/server'
import User from '../models/user'
import API from '../core/api'


Server.api('User', class extends API {


	async register(params, connection) {
		let login = params.get('login', String, {min: 3, max: 20, test: /^\S+$/})
		let pass = params.get('pass', String, {min: 3, max: 50, test: /^\S+$/})

		if (await User.have({login})) {
			connection.error(4, 'Пользователь с таким логином уже существует')
		}

		let user = await User.add({login, pass})
		let session = await user.startSession()
		await connection.setUser(user, session)

		return {
			session: session.fields('key'),
			user: user.fields('login')
		}
	}


	async login(params, connection) {
		let login = params.get('login', String, {max: 20})
		let pass = params.get('pass', String, {max: 50})

		let user = await User.findOne({login: login})

		if (!user) {
			connection.error(3, 'Не верный логин')
		}

		if (!user.checkPass(pass)) {
			connection.error(3, 'Не верный пароль')
		}

		let session = await user.startSession()
		await connection.setUser(user, session)

		return {
			session: session.fields('key'),
			user: user.fields('login')
		}
	}


	async logout(params, connection) {
		await connection.logoutUser()
		return true
	}


	async current(params, connection) {
		if (!connection.user) return null
		return connection.user.fields('login')
	}


})

