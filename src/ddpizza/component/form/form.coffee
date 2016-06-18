Map = require('ui-js/polyfill/map')


module.exports = class Form

	@styles: [require('./form.styl')]
	@selector: 'form'
	@template: "
		<content></content>
	"

	constructor: ->
		@value = Object.create(null)
		@inputs = new Map
		return


	addInput: (input)->
		dataBind = ui.bind(@value, input.name, input, 'value')
		@inputs.set(input, dataBind)
		return


	removeInput: (input)->
		dataBind = @inputs.get(input)
		dataBind.destroy()
		@inputs.delete(input)
		delete @value[input.name]
		return


	reset: ->
		@inputs.forEach (dataBind, input)->
			input.reset()
		return


	send: ->
		@emit('send', @value)
		return

		