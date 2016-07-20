import Button from '../button/button'


export default class Submit extends Button {

	static styles = [...Button.styles, `
		*{ color: blue !important }
	`]

	static selector = 'submit'
	static template = Button.template

	constructor() {
		super()
		// console.log('lol   ')
		let form = this.require('form')
		form = this.require('form')
		this.on('click', ()=> form.submit())
	}

}



