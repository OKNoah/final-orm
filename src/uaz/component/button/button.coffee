DOM = require('ui-js/dom')


module.exports = class Button

	@styles: [require('./button.styl')]
	@selector: 'button'
	@template: "
		<div .content
		.__left='state is LEFT'
		.__right='state is RIGHT'
		.__bottom='state is BOTTOM'
		.__top='state is TOP'>
			<content></content>
		</div>
	"

	NONE: 0
	LEFT: 1
	RIGHT: 2
	BOTTOM: 3
	TOP: 4


	constructor: ->
		@state = @NONE
		@on('mousedown', @onMouseDown)
		return


	onMouseDown: (event)=>
		event.prevent()

		width = @host.width()
		height = @host.height()
		x = event.layerX
		y = event.layerY

		states = []

		states.push state: @TOP, distance: y / height
		states.push state: @BOTTOM, distance: (height - y) / height
		states.push state: @LEFT, distance: x / width
		states.push state: @RIGHT, distance: (width - x) / width

		minState = states[0]
		for state in states
			if state.distance < minState.distance
				minState = state

		@state = minState.state

		DOM.one 'mouseup', => @state = @NONE
		return



