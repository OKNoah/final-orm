import Event from 'ui-js/dom/core/event'
import keyboard from 'ui-js/core/keyboard'


export default class Popup {

	static styles = [require('./popup.styl')]
	static selector = 'popup'

	static template = `
		<div .content #content>
			<div .scale #scale>
				<content></content>
			</div>
		</div>
	`

	constructor() {
		this.state = false
		this.bindClass('__active', 'state')
		this.bindClass('__non-active', '!state')
		this.initHandlers()
	}


	initHandlers() {
		keyboard.on('esc', ()=> this.exit())
		this.own('mousedown', event => {
			event.prevent()
			this.exit()
		})
	}


	open() {
		this.state = true
		this.openEffectFrom(Event.target)
		this.watch('state', value => {
			if (value) this.emit('open')
			else this.emit('close')
		})
	}


	openEffectFrom(target) {
		let content = this.locals.content
		let scale = this.locals.scale

		let transform = this.calcTransformFor(content, target)

		// start point
		content.renderCss({
			transition: 'none',
			transform: `translate(${transform.x}px, ${transform.y}px)`,
		})

		scale.renderCss({
			transition: 'none',
			transform: `scale(${transform.scaleX}, ${transform.scaleY})`,
		})

		// play animation
		content.renderCss({
			transform: '',
			transition: '',
			visibility: '',
		})

		scale.renderCss({
			transform: '',
			transition: '',
		})
	}


	calcTransformFor(content, target) {
		if (!target) return {x: 0, y: 0, scaleX: 0.5, scaleY: 0.5}

		let contentRect = this.getContentRect(content)
		let targetRect = this.getTargetRect(target)

		let targetX = targetRect.left + (targetRect.width / 2)
		let targetY = targetRect.top + (targetRect.height / 2)
		let contentX = this.locals.wrapper.width() / 2
		let contentY = this.locals.wrapper.height() / 2

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


	close() {
		this.state = false
	}


	exit() {
		this.close()
		this.emit('exit')
	}


	toggle() {
		this.state = !this.state
	}

}

		


