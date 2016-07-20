import Promise from 'ui-js/core/promise'
import keyboard from 'ui-js/core/keyboard'


export default class Confirm {

	static style = require('./confirm.styl')
	static tag = 'confirm'
	static template = `
		<modal #modal (exit)='reject()'>
			<div .text> {{ text }} </div>
			<div>
				<button (click)='resolve()'>Да</button>
				<button (click)='reject()'>Нет</button>
			</div>
		</modal>
	`

	constructor() {
		this.text = ''
		this.actvePromise = null
		keyboard.on('esc', ()=> this.reject())
		keyboard.on('enter', ()=> this.resolve())
	}


	resolve() {
		this.close()
		if (this.actvePromise) {
			this.actvePromise.resolve()
		}
		this.actvePromise = null
	}


	reject() {
		this.close()
		if (this.actvePromise) {
			this.actvePromise.reject()
		}
		this.actvePromise = null
	}


	open() {
		this.locals.modal.open()
	}


	close() {
		this.locals.modal.close()
	}


	confirm(text) {
		this.text = text
		this.open()
		if (this.actvePromise) {
			this.actvePromise.reject()
		}
		this.actvePromise = new Promise()
		return this.actvePromise
	}

}

