import Connection from '../core/connection'
import User from '../models/user'


Connection.addMethods('user', {

	async add(){
		return await User.findOne()
	},

	async remove(){
		// if(this.user.isAdmin())
		return await User.findOne()
	}

})

