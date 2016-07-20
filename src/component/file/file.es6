export default class File {

	static style = require('./file.styl')
	static selector = 'file'

	static template = `
		<button .button>
		
			<div .label *if='not fileInfo'>
				<content></content>
			</div>
	
			<input #input .input
			(change)='onChange()'
			type='file'
			[multiple]='multiple'
			[value]='value'>
			</input>
	
			<div .info *if='fileInfo'>
				<div .controls>
					<span .reset (click)='reset()'></span>
				</div>
	
			  <span .name>{{ fileInfo.name }}</span>
			</div>
		
		</button>
	`

	constructor() {
		this.multiple = this.host.hasAttr('multiple')
		this.fileInfo = null
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


	onChange() {
		if (!this.value.length) {
			this.fileInfo = null
		}
		else {
			let firstFile = this.value[0]
			this.fileInfo = {name: firstFile.name}
		}
	}


	reset() {
		this.locals.input.reset()
	}
}


