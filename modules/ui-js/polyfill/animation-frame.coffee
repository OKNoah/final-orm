module.exports = window.requestAnimationFrame?.bind(window) or
		window.webkitRequestAnimationFrame?.bind(window) or
		window.mozRequestAnimationFrame?.bind(window) or
		window.oRequestAnimationFrame?.bind(window) or
		window.msRequestAnimationFrame?.bind(window) or
		(callback, element)->
			window.setTimeout(callback, 1000 / 60)

