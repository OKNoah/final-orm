import Event from 'ui-js/dom/core/event'
import keyboard from 'ui-js/core/keyboard'


export default class Popup {

	static style = require('./popup.styl')
	static tag = 'popup'

	static template = `
		<div .content #content>
			<div .scale #scale>
				<content></content>
			</div>
		</div>
	`

	constructor() {
		this.active = false
		this.bindClass('__active', 'active')
		this.bindClass('__non-active', '!active')
		this.initHandlers()
	}


	initHandlers() {
		keyboard.on('esc', ()=> this.close())
		this.on('mousedown', event => this.onMouseDown(event))
	}


	onMouseDown(event) {
		let targets = [
			this.host,
			this.scope.scale,
			this.scope.content
		]

		if (targets.indexOf(event.src) !== -1) {
			event.prevent()
			this.close()
		}
	}


	openEffectFrom(target) {
		let content = this.scope.content
		let scale = this.scope.scale

		let transform = this.getTransform(content, target)
		let x = transform.x
		let y = transform.y
		let scaleX = transform.scaleX
		let scaleY = transform.scaleY

		// start point
		content.renderCss({
			transition: 'none',
			transform: `translate(${x}px, ${y}px) scale(${scaleX}, ${scaleY})`,
		})

		// play animation
		content.renderCss({
			transform: '',
			transition: '',
		})
	}


	getTransform(content, target) {
		if (!target) return {x: 0, y: 0, scaleX: 0.5, scaleY: 0.5}

		let targetRect = this.getTargetRect(target)
		let contentRect = this.getContentRect(content)

		let targetX = targetRect.left + (targetRect.width / 2)
		let targetY = targetRect.top + (targetRect.height / 2)
		let contentX = contentRect.left + (contentRect.width / 2)
		let contentY = contentRect.top + (contentRect.height / 2)

		let x = targetX - contentX
		let y = targetY - contentY
		let scaleX = targetRect.width / contentRect.width
		let scaleY = targetRect.height / contentRect.height

		return {x, y, scaleX, scaleY}
	}


	getContentRect(element) {
		element.style.transform = 'none'
		element.style.transition = 'none'
		element.renderStyle()
		return element.rect()
	}


	getTargetRect(element) {
		return element.rect()
	}


	open() {
		this.active = true
		this.openEffectFrom(Event.target)
		this.emit('open')
	}


	close() {
		this.active = false
		this.emit('close')
	}


	toggle() {
		if (this.active) this.close()
		else this.open()
	}

}

		


