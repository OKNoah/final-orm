Platform = require('ui-js/core/platform')
Notificator = require('./notificator/notificator')
Gallery = require('./gallery/gallery')
Confirm = require('./confirm/confirm')
Server = require('../core/server')


module.exports = class App

	@styles: [require('./app.styl')]
	@components: [Gallery, Confirm, Notificator]
	@selector: 'my-app'
	@template: "
		<gallery #gallery></gallery>
		<confirm #confirm></confirm>
		<notificator #notificator></notificator>

		<button (click)='send()'>send</button>
	"


	constructor: ->
		@platform = new Platform()
		@server = new Server(8080)
		@fontSize = 50
		@updateFonts()
		@bindHostClasses()
		@initHandlers()
		return



	send: ()->
		@server.send()
		return


	bindHostClasses: ->
		@bindClass('__ms', 'platform.ms')
		@bindClass('__ie', 'platform.ie')
		@bindClass('__edge', 'platform.edge')
		@bindClass('__chrome', 'platform.chrome')
		@bindClass('__firefox', 'platform.firefox')
		return


	initHandlers: ->
		@watch 'fontSize', (value)=> @updateFonts()
		ui.dom.on 'DOMContentLoaded', => @updateFonts()
		ui.dom.on 'resize', => @updateFonts()
		return


	gallery: (urls)->
		@locals.gallery.open(urls)
		return


	alert: (message)->
		@locals.notificator.alert(message)
		return


	error: (message)->
		@locals.notificator.error(message)
		return


	warning: (message)->
		@locals.notificator.warning(message)
		return


	confirm: (text)->
		return @locals.confirm.confirm(text)


	updateFonts: ->
		fontSize = @host.width() / @fontSize
		@host.style.fontSize = "#{fontSize}px"
		return

