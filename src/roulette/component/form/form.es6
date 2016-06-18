import Map from 'ui-js/polyfill/map'


export default class Form {

	static styles = [require('./form.styl')]
	static selector = 'form'

	static template = `
		<content></content>
	`

	constructor() {
		this.value = Object.create(null)
		this.inputs = new Map()
	}


	addInput(input) {
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
	}


	send() {
		this.emit('send', this.value)
	}

}

		