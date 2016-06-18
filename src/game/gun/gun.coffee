Dummy = require '.././dummy/dummy'
Weapon = require './weapon/weapon'


module.exports = class Gun extends Dummy

	@styles: Dummy.styles.concat [require('./gun.styl')]
	@components: [Weapon]
	@selector: 'gun'
	@template: "
		<weapon #weapon [position.x]='width/2'></weapon>
	"

	constructor: ->
		super
		@width = 13
		@height = 8
		@active = off
		@maxAngle = 50
		@cooldown = 4000
		@lastFireTime = 0
		@bullets = []
		@updateMetric()
		@initHandlers()
		return


	start: ->
		@active = on
		@startAllBullets()
		return


	stop: ->
		@active = off
		@stopAllBullets()
		@stopTurn()
		return


	reset: ->
		@stopTurn()
		@removeAllBullets()
		@locals.weapon.angle = 0
		@active = off
		return


	startAllBullets: ->
		for bullet in @bullets then bullet.start()
		return


	stopAllBullets: ->
		for bullet in @bullets then bullet.stop()
		return


	removeAllBullets: ->
		@bullets = []
		return


	initHandlers: ->
		@app.on 'resize', => @updateMetric()
		window.addEventListener('keydown', @onKeyDown)
		window.addEventListener('keyup', @onKeyUp)
		return


	updateMetric: =>
		@position.set(@app.width / 2 - @width / 2, @app.height - @height)
		return


	onKeyDown: (event)=>
		unless @active then return
		switch event.keyCode
			when 37, 100 then @turnLeft()
			when 38, 104 then @fire()
			when 39, 102 then @turnRight()
		return


	onKeyUp: (event)=>
		unless @active then return
		switch event.keyCode
			when 37, 100 then @stopTurn()
			when 39, 102 then @stopTurn()
		return


	fire: ->
		now = Date.now()
		if now - @lastFireTime < @cooldown then return
		weapon = @locals.weapon

		position = weapon.absolute()
		position = position.byAngle(weapon.angle, weapon.height)
		@bullets.push(new Bullet(position, weapon.angle))
		@lastFireTime = now
		return


	removeBullet: (bullet)->
		index = @bullets.indexOf(bullet)
		if index is -1 then return
		@bullets.splice(index, 1)
		return


	turnLeft: ->
		@locals.weapon.rotate(-@maxAngle)
		return


	turnRight: ->
		@locals.weapon.rotate(@maxAngle)
		return


	stopTurn: ->
		@locals.weapon.stopRotate(@maxAngle)
		return


############################################
# Bullet
############################################
class Bullet

	constructor: (@position, @angle)->
		@active = on
		return


	start: ->
		@active = on
		return


	stop: ->
		@active = off
		return

