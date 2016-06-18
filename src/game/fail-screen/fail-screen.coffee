failSound = require('./fail.mp3')


module.exports = class FailScreen

	@styles: [require('./fail-screen.styl')]
	@selector: 'fail-screen'
	@template: "
		<div *if='not isComplete' .logo>
			<div .sec [style.backgroundImage]='url({{ secUrl }})'></div>
		</div>

		<div *if='isComplete' .game-over></div>
	"

	constructor: ->
		@secUrl = ''
		@lastSecond = 10
		@id = null
		@activate = off
		@isComplete = off
		@bindClass('__active', 'activate')
		return


	start: ->
		if @activate then return
		@activate = yes
		@setSecond(@lastSecond--)
		@id = setInterval =>
			if @lastSecond is -1
				@stop()
				@complete()
				return
			@setSecond(@lastSecond--)
		, 1000
		return


	stop: ->
		clearInterval(@id)
		return


	complete: ->
		@isComplete = yes
		@app.playSound(failSound)
		return


	setSecond: (number)->
		@secUrl = require('./' + number + '.jpg')
		return








