import Text from '../text/text'


export default class Textarea extends Text {

	static styles = [require('./textarea.styl')]
	static selector = 'textarea'
	static template = `
		<label .container
		.__active='focused or value'
		.__error='activity and error'>

			<div .label *if='host.attrs.label'>
				{{ host.attrs.label }}
			</div>

			<textarea .textarea
			[type]='type'
			[value]='value'
			(focus)='onFocus()'
			(blur)='onBlur()'></textarea>

		</label>
	`

}

    
    

