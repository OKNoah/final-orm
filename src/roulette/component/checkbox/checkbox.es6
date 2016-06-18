export default class Checkbox {

	static styles = [require('./checkbox.styl')]
	static selector = 'checkbox'
	static template = `
		<label .container .__active='value'>
			<div .checkbox></div>
			<div .label> <content></content> </div>
		</label>
	`

	constructor() {
		this.value = false
		this.host.on('mousedown', event => {
			event.prevent()
			this.toggle()
		})

		this.name = this.host.attr('name')
		this.form = this.require('form?')
		if (this.form) {
			this.form.addInput(this)
		}
	}


	destructor() {
		if (this.form) {
			this.form.removeInput(this)
		}
	}


	reset() {
		this.value = false
	}


	toggle() {
		this.value = !this.value
	}

}


