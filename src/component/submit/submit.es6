import Button from '../button/button'


export default class Submit extends Button {

	static styles = [...Button.styles, `
		*{ color: red !important }
	`]

	static selector = 'submit'

	constructor() {
		super()
		let form = this.require('form')
		this.on('click', ()=> form.submit())
	}

}



