Event = require('ui-js/dom/core/event')
keyboard = require('ui-js/core/keyboard')


module.exports = class Popup

	@styles: [require('./popup.styl')]
	@selector: 'popup'
	@template: "
		<div .content #content>
			<div .scale #scale>
				<content></content>
			</div>
		</div>
	"

	constructor: ->
		@state = off
		@bindClass '__active', 'state'
		@bindClass '__non-active', '!state'
		@initHandlers()
		return


	initHandlers: ->
		keyboard.on 'esc', => @exit()
		@own 'mousedown', (event)=>
			event.prevent()
			@exit()
		return


	open: ->
		@state = on
		@openEffectFrom(Event.target)
		@watch 'state', (value)=>
			if value then @emit('open')
			else @emit('close')
		return


	openEffectFrom: (target)->
		content = @locals.content
		scale = @locals.scale

		transform = @calcTransformFor(content, target)

		# start point
		content.renderCss
			transition: 'none'
			transform: "translate(#{transform.x}px, #{transform.y}px)"

		scale.renderCss
			transition: 'none'
			transform: "scale(#{transform.scaleX}, #{transform.scaleY})"

		# play animation
		content.renderCss
			transform: ''
			transition: ''
			visibility: ''

		scale.renderCss
			transform: ''
			transition: ''

		return


	calcTransformFor: (content, target)->
		unless target then return {x: 0, y: 0, scaleX: 0.5, scaleY: 0.5}

		contentRect = @getContentRect(content)
		targetRect = @getTargetRect(target)

		targetX = targetRect.left + (targetRect.width / 2)
		targetY = targetRect.top + (targetRect.height / 2)
		contentX = @locals.wrapper.width() / 2
		contentY = @locals.wrapper.height() / 2

		x = targetX - contentX
		y = targetY - contentY
		scaleX = targetRect.width / contentRect.width
		scaleY = targetRect.height / contentRect.height

		return {x, y, scaleX, scaleY}


	getContentRect: (element)->
		element.style.transform = 'none'
		element.style.transition = 'none'
		element.renderStyle()
		return element.rect()


	getTargetRect: (element)->
		return element.rect()


	close: ->
		@state = off
		return


	exit: ->
		@close()
		@emit('exit')
		return


	toggle: ->
		@state = !@state
		return

		


