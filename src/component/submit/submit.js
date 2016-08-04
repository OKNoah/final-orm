import Button from '../button/button'


export default class Submit extends Button {

	static tag = 'submit'

	constructor() {
		super()
		let form = this.require('form')
		form = this.require('form')
		this.on('click', ()=> form.submit())
	}

}



