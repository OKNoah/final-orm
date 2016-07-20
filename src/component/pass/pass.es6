import Text from '../text/text'


export default class Pass extends Text {

	static tag = 'pass'

	constructor() {
		super()
		this.type = 'password'
		this.length = 6
	}


	test(value) {
		return value.length >= this.length
	}
}



