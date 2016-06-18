Element = require('./nodes/element') 
Comment = require('./nodes/comment')
Text = require('./nodes/text')
HtmlParser = require('./core/html-parser')


# default elements
Input = require('./nodes/input')
Img = require('./nodes/img')


module.exports = class DOM


	@elements:
		input: Input
		img: Img


	@createElement: (type, attrs)->
		Constructor = @elements[type] or Element
		return new Constructor(type, attrs)


	@createText: (text)->
		return new Text(text)


	@createComment: (text)->
		return new Comment(text)


	@registerElement: (type, Constructor)->
		@elements[type] = Constructor
		return


	@parse: (html)->
		@htmlParser ?= new HtmlParser()
		return @htmlParser.parse(html)


	@on: (event, handler)->
		window.addEventListener(event, handler)
		return


	@off: (event, handler)->
		window.removeEventListener(event, handler)
		return


	@one: (event, handler)->
		dom = @
		wrapper = ->
			returns = handler.apply(@, arguments)
			dom.off(event, wrapper)
			return returns
		@on(event, wrapper)
		return


