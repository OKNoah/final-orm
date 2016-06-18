EventEmitter = require('ui-js/core/event-emitter')


module.exports = class Notificator

	@styles: [require('./notificator.styl')]
	@selector: 'notificator'
	@template: "
		<div .message
			*for='message in messages'
			(click)='message.remove()'
			.__alert='message.type is ALERT'
			.__error='message.type is ERROR'
			.__warning='message.type is WARNING'>
			{{ message.text }}
		</div>
	"

	ALERT: 0
	ERROR: 1
	WARNING: 2


	constructor: ->
		@messages = []
		@own 'mouseenter', => @pauseAll()
		@own 'mouseleave', => @resumeAll()
		return


	addMessage: (text, type)->
		message = new Message(text, type)
		@messages.push(message)
		message.on 'remove', =>
			@removeMessage(message)
		return


	pauseAll: ->
		for message in @messages
			message.pause()
		return


	resumeAll: ->
		for message in @messages
			message.resume()
		return


	removeMessage: (message)->
		index = @messages.indexOf(message)
		if index is -1 then return
		@messages.splice(index, 1)
		return


	alert: (text)->
		@addMessage(text, @ALERT)
		return


	error: (text)->
		@addMessage(text, @ERROR)
		return


	warning: (text)->
		@addMessage(text, @WARNING)
		return


class Message extends EventEmitter


	constructor: (@text, @type, @time = 2500)->
		super
		@id = setTimeout =>
			@remove()
		, @time
		return


	remove: ->
		clearTimeout(@id)
		@emit('remove')
		return


	pause: ->
		clearTimeout(@id)
		return


	resume: ->
		@id = setTimeout =>
			@remove()
		, 500
		return

