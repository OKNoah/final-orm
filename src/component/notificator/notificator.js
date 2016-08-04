import EventEmitter from 'ui-js/core/event-emitter'


export default class Notificator {

	static tag = 'notificator'
	static style = require('./notificator.styl')
	static template = `
		<div .message
			*for='message in messages'
			(click)='message.remove()'
			.__alert='message.type is ALERT'
			.__error='message.type is ERROR'
			.__warning='message.type is WARNING'>
			{{ message.text }}
		</div>
	`


	constructor() {
		this.ALERT = 0
		this.ERROR = 1
		this.WARNING = 2
		this.messages = []
		this.own('mouseenter', ()=> this.pauseAll())
		this.own('mouseleave', ()=> this.resumeAll())
	}


	addMessage(text, type) {
		let message = new Message(text, type)
		this.messages.push(message)
		message.on('remove', ()=>
			this.removeMessage(message)
		)
	}


	pauseAll() {
		this.messages.forEach(message => message.pause())
	}


	resumeAll() {
		this.messages.forEach(message => message.resume())
	}


	removeMessage(message) {
		let index = this.messages.indexOf(message)
		if (index === -1) return
		this.messages.splice(index, 1)
	}


	alert(text) {
		this.addMessage(text, this.ALERT)
	}


	error(text) {
		this.addMessage(text, this.ERROR)
	}


	warning(text) {
		this.addMessage(text, this.WARNING)
	}

}


export class Message extends EventEmitter {


	constructor(text, type, time = 3000) {
		super()
		this.text = text
		this.type = type
		this.time = time
		this.id = ui.timeout(()=> {
			this.remove()
		}, this.time)
	}


	remove() {
		clearTimeout(this.id)
		this.emit('remove')
	}


	pause() {
		clearTimeout(this.id)
	}


	resume() {
		this.id = setTimeout(()=> this.remove(), 500)
	}

}



