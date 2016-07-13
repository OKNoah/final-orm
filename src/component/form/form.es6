import Map from 'ui-js/polyfill/map'
import ui from 'ui-js'


export default class Form {

	static styles = [require('./form.styl')]
	static selector = 'form'

	static template = `
		<form>
			<content></content>
		</form>
	`

	constructor() {
		this.value = {}
		this.inputs = new Map()
	}


	addInput(input) {
		if (!input.name) throw new Error('form input not have "name" attribute')
		let dataBind = ui.bind(this.value, input.name, input, 'value')
		this.inputs.set(input, dataBind)
	}


	removeInput(input) {
		let dataBind = this.inputs.get(input)
		dataBind.destroy()
		this.inputs.delete(input)
		delete this.value[input.name]
	}


	reset() {
		this.inputs.forEach((dataBind, input)=> input.reset())
		this.emit('reset', this.value)
	}


	send() {
		this.emit('send', this.value)
	}


	toJSON() {
		return this.value
	}

}

		