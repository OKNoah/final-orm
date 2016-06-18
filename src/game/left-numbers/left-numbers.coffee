module.exports = class LeftNumbers

	@styles: [require('./left-numbers.styl')]
	@selector: 'left-numbers'
	@template: "
		<div .content>
			<div> НТУ 11: </div>
			<div> {{ a }} </div>
			<div> {{ b }} </div>
			<div> СК ТКу: </div>
			<div> {{ c }} Т Кв </div>
			<div> {{ d }} МБ мм </div>
		</div>
	"


	constructor: ->
		@a = 55.183356
		@b = 37.527980
		@c = 1
		@d = 2
		@start()
		return


	start: ->
		setInterval =>
			@a = (+@a + 0.000005).toFixed(6)
			@b = (+@b + 0.00001).toFixed(6)
		, 1000

		@startRandomC()
		@startRandomD()
		return


	startRandomC: ->
		value = @random(333, 335)
		@c = @round(value, 1)
		setTimeout =>
			@startRandomC()
		, @random(1000, 3000)
		return


	startRandomD: ->
		value = @random(280, 290)
		@d = @round(value, 5)
		setTimeout =>
			@startRandomD()
		, @random(1000, 3000)
		return


	random: (min, max)->
		return Math.random() * (max - min) + min


	round: (value, i = 0)->
		q = Math.round(value * 10)
		q -= q % i
		return q / 10

