winSound = require('./win.mp3')
video = require('./video.mp4')


module.exports = class WinScreen

	@styles: [require('./win-screen.styl')]
	@selector: 'win-screen'
	@template: "
		<div *if='stage is LOGO1' .logo1></div>
		<div *if='stage is LOGO2' .logo2></div>
		<video *if='stage is VIDEO' src='{{ videoSrc }}' autoplay .video></video>
	"

	LOGO1: 0
	LOGO2: 1
	VIDEO: 2

	constructor: ->
		@active = off
		@stage = @LOGO1
		@videoSrc = video
		@bindClass('__active', 'active')
		return


	start: ->
		@active = on
		@app.playSound(winSound)
		@id = setTimeout =>
			@stage = @LOGO2
			@id = setTimeout =>
				@stage = @VIDEO
				@playVideo()
			, 2000
		, 2000
		return


	playVideo: ->
		return


	stop: ->
		@active = off
		@stage = @LOGO1
		clearTimeout(@id)
		return


