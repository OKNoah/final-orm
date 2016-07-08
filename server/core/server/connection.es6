import ApiError from './errors/api-error'
import Task from './task'


export default class Connection {


	constructor(server, socket, user, session, headers, cookies) {
		this.session = session
		this.cookies = cookies
		this.headers = headers
		this.server = server
		this.socket = socket
		this.user = user
		this.initHandlers()
	}


	initHandlers() {
		this.socket.on('request', request => this.onRequest(request))
	}


	async setUser(user, session) {
		await this.logoutUser()
		this.user = user
		this.session = session
	}


	async logoutUser() {
		if (this.session) {
			await this.session.close()
		}
		this.user = null
		this.session = null
	}


	async onRequest(request) {
		let tasks = request.tasks
		let id = request.id
		tasks = tasks.map(options => new Task(this, options))
		for (let task of tasks) await task.run()
		let responses = tasks.map(task => task.toJSON())
		this.sendResponse(responses, id)
	}


	sendResponse(responses, id) {
		this.socket.emit('response', {
			responses: responses,
			id: id
		})
	}


	error(code, message) {
		throw new ApiError(code, message)
	}

}

