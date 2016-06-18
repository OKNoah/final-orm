module.exports = class File

	@styles: [require('./file.styl')]
	@selector: 'file'
	@template: "
		<div .label *if='not fileInfo'>Обзор...</div>

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
	"

	constructor: ->
		@multiple = @host.hasAttr('multiple')
		@fileInfo = null
		@form = @require('form?')
		@name = @host.attr('name')
		@form?.addInput(@)
		return

		
	destructor: ->
		@form?.removeInput(@)
		return


	onChange: ->
		unless @value.length
			@fileInfo = null
		else
			firstFile = @value[0]
			@fileInfo =
				name: firstFile.name
		return


	reset: ->
		@locals.input.reset()
		return

