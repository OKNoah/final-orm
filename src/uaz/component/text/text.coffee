module.exports = class Text

	@styles: [require('./text.styl')]
	@selector: 'text'
	
	@template: "
		<label .container
		.__active='focused or value'
		.__error='activity and error'>


			<input #input .input .__focused='focused'
			[type]='type'
			[value]='value'
			(focus)='onFocus()'
			(blur)='onBlur()'>


			<div *if='host.attrs.label' .label>
				{{ host.attrs.label }}
			</div>

		</label>
	"

	constructor: ->
		@value = ''
		@type = 'text'
		@focused = off
		@error = off
		@activity = off
		@valueObserver = ui.watch @, 'value', (value)=>
			@testValue(value)
			return

		@form = @require('form?')
		@name = @host.attr('name')
		@form?.addInput(@)
		return


	destructor: ->
		@form?.removeInput(@)
		@valueObserver.destroy()
		return


	reset: ->
		input = @locals.input
		input.reset()
		@value = input.value
		return


	testValue: (value)->
		unless @test
			@error = off
		else if typeof @test is 'function'
			@error = not @test(value)
		else
			@error = not @test.test(value)
		return


	onFocus: ->
		@focused = on
		return


	onBlur: ->
		@activity = on
		@focused = off
		return



