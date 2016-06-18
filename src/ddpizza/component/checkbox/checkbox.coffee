module.exports = class Checkbox

	@styles: [require('./checkbox.styl')]
	@selector: 'checkbox'
	@template: "
		<label .container .__active='value'>
			<div .checkbox></div>
			<div .label> <content></content> </div>
		</label>
	"

	constructor: ->
		@value = off
		@host.on 'mousedown', (event)=>
			event.prevent()
			@toggle()

		@name = @host.attr('name')
		@form = @require('form?')
		@form?.addInput(@)
		return


	destructor: ->
		@form?.removeInput(@)
		return


	reset: ->
		@value = false
		return


	toggle: ->
		@value = !@value
		return

