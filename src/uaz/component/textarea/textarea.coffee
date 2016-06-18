Text = require('../text/text')


module.exports = class Textarea extends Text

	@styles: [require('./textarea.styl')]
	@selector: 'textarea'
	@template: "
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
	"
    
    

