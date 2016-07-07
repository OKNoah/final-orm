import server from './server'


export default class API {

	static server = server

	static call(method, ...args) {
		return this.server.call(`${this.name}.${method}`, ...args)
	}

}

