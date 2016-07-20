import Button from '../button/button'


export default class Submit extends Button {

	static style = `
		*{ color: red !important }
	`

	static selector = 'submit'
	// static template = Button.template + '!!!!!!'

	constructor() {
		super()
		let form = this.require('form')
		form = this.require('form')
		this.on('click', ()=> form.submit())
	}

}



