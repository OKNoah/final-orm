import orm from './orm'

let OrmModel = orm.connect({
	database: 'oiopoppo',
})


export default class Model extends OrmModel {

	fields(...props) {
		props.push('_id', '_key', '_removed', '_rev')

		let obj = {}
		for (let prop of props) {
			obj[prop] = this[prop]
		}
		return obj
	}

}




