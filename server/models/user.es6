import Model from '../core/model'


class User extends Model {

	static schema = {
		name: String,
		age: String,
		friend: User,
	}

}


(async function () {

	let user = await User.add({name: 'Ашот', age: 33})
	let user2 = await User.add({name: 'Гриша', age: 11})



})()

console.log(333)


