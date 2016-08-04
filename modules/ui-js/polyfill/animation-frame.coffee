requestFrame = window.requestAnimationFrame?.bind(window) or
	window.webkitRequestAnimationFrame?.bind(window) or
	window.mozRequestAnimationFrame?.bind(window) or
	window.oRequestAnimationFrame?.bind(window) or
	window.msRequestAnimationFrame?.bind(window) or
	(callback, element)-> window.setTimeout(callback, 1000 / 60)

stopFrame = window.cancelAnimationFrame?.bind(window) or
	window.webkitCancelAnimationFrame?.bind(window) or
	window.mozCancelAnimationFrame?.bind(window) or
	window.oCancelAnimationFrame?.bind(window) or
	window.msCancelAnimationFrame?.bind(window) or
	(id)-> window.clearTimeout(id)


module.exports = (args...)-> requestFrame(args...)
module.exports.stop = (args...)-> stopFrame(args...)



