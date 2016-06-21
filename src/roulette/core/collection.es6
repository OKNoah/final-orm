import Server from './server'
let server = new Server()


export default class Collection {

	constructor(name) {
		this.name = name
	}


	async call(method, ...args) {
		let fullMethodName = `${name}.${method}`.toLocaleLowerCase()
		return server.call(fullMethodName, {args})
	}

}


