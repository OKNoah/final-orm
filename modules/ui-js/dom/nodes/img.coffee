Element = require('./element') 


module.exports = class Img extends Element

	
	Object.defineProperty @prototype, 'src',
		get: -> @src_
		set: (type)-> @setSrc(type)
		configurable: on


	constructor: ->
		super
		@src = @attr('src') or ''
		return


	setSrc: (src)->
		@src_ = src += ''
		@attr('src', @src_)
		return


	append: ->
		throw Error '<img> element cannot have child nodes'
		return


	prepend: ->
		throw Error 'img element cannot have children'
		return

		