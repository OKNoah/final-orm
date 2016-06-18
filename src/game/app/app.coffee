Vector = require('../core/vector')
Dummy = require('../dummy/dummy')
Rocket = require('../rocket/rocket')
Gun = require('../gun/gun')
Bullet = require('../bullet/bullet')
WinScreen = require('../win-screen/win-screen')
FailScreen = require('../fail-screen/fail-screen')
Radar = require('../radar/radar')
Graph = require('../graph/graph')
GunInfo = require('../gun-info/gun-info')
RightNumbers = require('../right-numbers/right-numbers')
LeftNumbers = require('../left-numbers/left-numbers')


module.exports = class App extends Dummy

	@components: [Dummy, Rocket, Gun, Bullet, Radar, Graph, GunInfo, RightNumbers, LeftNumbers, WinScreen, FailScreen]
	@styles: Dummy.styles.concat [require('./app.styl')]
	@selector: 'my-app'
	@template: "
		<win-screen #winScreen (click)='restart()'></win-screen>
		<fail-screen #failScreen></fail-screen>

		<graph></graph>
		<gun-info></gun-info>
		<right-numbers></right-numbers>
		<left-numbers></left-numbers>

		<div .black-screen *if='not active and not winScreenIsShowed'></div>
		<radar></radar>

		<rocket #rocket></rocket>
		<gun #gun></gun>

		<bullet
		*for='bullet in gun.bullets'
		[data]='bullet' [target]='rocket'
		(out-of-world)='gun.removeBullet(bullet)'
		(hit-the-target)='app.win()'>
		</bullet>
	"

	@template2: "
		<win-screen #winScreen (click)='restart()'></win-screen>
		<fail-screen #failScreen></fail-screen>

		<graph></graph>
		<gun-info></gun-info>
		<right-numbers></right-numbers>
		<left-numbers></left-numbers>

		<div .black-screen *if='not active and not winScreenIsShowed'></div>
		<radar></radar>

		<rocket #rocket></rocket>
		<gun #gun></gun>

		<bullet
		*for='bullet in gun.bullets'
		[data]='bullet' [target]='rocket'
		(out-of-world)='gun.removeBullet(bullet)'
		(hit-the-target)='app.win()'>
		</bullet>
	"

	constructor: ->
		super(0, 0, 150, 10)
		@fontSize = 150
		@active = off
		@failingStarted = off
		@winScreenIsShowed = off
		@initHandlers()
		return


	initHandlers: ->
		ui.init => @sizeChange()
		ui.resize => @sizeChange()
		ui.keyboard.on 'home, 7', => @start()
		ui.keyboard.on 'end', => @fail()
		ui.dom.on 'keydown', (event)=>
			if event.keyCode is 103 then @start()
		return


	win: ->
		if @failingStarted then return
		unless @active then return
		@stop()
		@winScreenIsShowed = yes
		@locals.winScreen.start()
		return


	fail: ->
		@stop()
		@failingStarted = yes
		@locals.failScreen.start()
		return


	start: ->
		if @winScreenIsShowed then return
		if @failingStarted then return
		if @active then return
		@active = yes
		@locals.rocket.start()
		@locals.gun.start()
		return


	stop: ->
#		unless @active then return
		@active = no
		@locals.rocket.stop()
		@locals.gun.stop()
		return


	reset: ->
		@winScreenIsShowed = no
		@locals.winScreen.stop()
		@locals.rocket.reset()
		@locals.gun.reset()
		return


	restart: ->
		@reset()
		@start()
		return



	sizeChange: ->
		clientWidth = document.documentElement.clientWidth
		clientHeight = document.documentElement.clientHeight

		fontSize = clientWidth / @fontSize
		@host.style.fontSize = "#{fontSize}px"

		@height = @fontSize * clientHeight / clientWidth
		@width = @fontSize
		@emit('resize')
		return


	playSound: (src)->
		audio = document.createElement('audio')
		audio.autoplay = on
		audio.src = src
		return

