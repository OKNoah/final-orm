import Text from '../text/text'


export default class Textarea extends Text {

	static style = require('./textarea.styl')
	static tag = 'textarea'
	static template = `
		<label .container
		.__active='focused or value'
		.__error='activity and error'>

			<div .label>
				<content></content>
			</div>

			<textarea .textarea
			[type]='type'
			[value]='value'
			(focus)='onFocus()'
			(blur)='onBlur()'></textarea>

		</label>
	`

	onKeyDown(event) {
		if (event.realEvent.ctrlKey && event.realEvent.keyCode == 13) {
			this.form.submit()
		}
	}


}

    
    

