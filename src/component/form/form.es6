import ui from 'ui-js'
import Map from 'ui-js/polyfill/map'
import File from '../file/file'


export default class Form {

	static styles = [require('./form.styl')]
	static selector = 'form'

	static template = `
		<form>
			<content></content>
		</form>
	`

	constructor() {
		console.log('create form   ')
		this.value = {}
		this.inputs = new Map()
		this.inputsByName = {}
	}


	get(name) {
		return this.value[name]
	}


	has(name, errorMessage) {
		if (this._isEmpty(name)) {
			if (errorMessage) {
				this.app.error(errorMessage)
				throw new Error(errorMessage)
			}
			return false
		}
		return true
	}


	_isEmpty(name) {
		let input = this.inputsByName[name]
		let value = this.get(name)

		if (input instanceof File) {
			return value.length === 0
		}

		return value == null
	}


	addInput(input) {
		let name = input.name
		if (!name) throw new Error('form input have not attribute "name"')
		let dataBind = ui.bind(this.value, name, input, 'value')
		this.inputsByName[name] = input
		this.inputs.set(input, dataBind)
	}


	removeInput(input) {
		let dataBind = this.inputs.get(input)
		let name = input.name
		dataBind.destroy()
		this.inputs.delete(input)
		delete this.inputsByName[name]
		delete this.value[name]
	}


	reset() {
		this.inputs.forEach((dataBind, input)=> input.reset())
		this.emit('reset', this.value)
	}


	submit() {
		this.emit('submit', this.value)
	}


	toJSON() {
		return this.value
	}

}

		