export default class Option {

	static style = require('./option.styl')
	static selector = 'option'

	static template = `
		<content></content> 
	`

	constructor() {
		this.self = this
		this.value = null
		this.select = this.require('select')
		this.select.addOption(this)
		this.bindClass('__focus', 'select.focus')
		this.bindClass('__active', 'self is select.activeOption')
		this.initHandlers()
	}


	initHandlers() {
		this.on('click', ()=> this.select.activate(this))
	}


	destructor() {
		this.select.removeOption(this)
	}

}

