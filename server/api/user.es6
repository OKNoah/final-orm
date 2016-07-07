import Connection from '../core/server'
import User from '../models/user'


Connection.addMethods('user', {


	async register(form){
		let login = form.login
		let pass = form.pass

		if (await User.have({login})) {
			this.error(4, 'Пользователь с таким логином уже существует')
		}

		let user = await User.add({login, pass})
		let session = await user.startSession()
		await this.setUser(user, session)

		return {
			session: session.fields('key'),
			user: user.fields('login')
		}
	},


	async login(form){
		let login = form.login
		let pass = form.pass
		let user = await User.findOne({login: login})

		if (!user) {
			this.error(2, 'Не верный логин')
		}

		if (user.checkPass(pass)) {
			this.error(2, 'Не верный пароль')
		}

		let session = await user.startSession()
		await this.setUser(user, session)

		return {
			session: session.fields('key'),
			user: user.fields('login')
		}
	},


	async logout(){
		await this.logoutUser()
	},


	async current(){
		if (!this.user) return null
		return this.user.fields('login')
	},


})

