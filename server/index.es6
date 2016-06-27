import 'babel-polyfill'


// import User from './models/user'


import connection from './core/connection'


connection.addMethods({

	async 'ololo' (a, b) {
		throw 33
		return a + b
	},


	// 'user.remove' (q, w, e) {
	//
	// 	// this.user.
	// 	this.progress(33)
	// 	this.resolve('dd')
	// 	this.reject(33)
	//
	// }

})

