Promise = require('ui-js/core/promise')
keyboard = require('ui-js/core/keyboard')


module.exports = class Confirm

	@styles: [require('./confirm.styl')]
	@selector: 'confirm'
	@template: "
		<modal #modal (exit)='reject()'>
			<div .text>{{ text }} </div>
			<div>
				<button (click)='resolve()'>Да</button>
				<button (click)='reject()'>Нет</button>
			</div>
		</modal>
	"

	constructor: ->
		@text = ''
		@actvePromise = null
		keyboard.on 'esc', => @reject()
		keyboard.on 'enter', => @resolve()
		return


	resolve: ->
		@close()
		@actvePromise?.resolve()
		@actvePromise = null
		return


	reject: ->
		@close()
		@actvePromise?.reject()
		@actvePromise = null
		return


	open: ->
		@locals.modal.open()
		return


	close: ->
		@locals.modal.close()
		return


	confirm: (@text)->
		@open()
		@actvePromise?.reject()
		@actvePromise = new Promise()
		return @actvePromise

