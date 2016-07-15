module.exports = class HtmlParser


	SINGLE_TAGS = '
		area base basefont bgsound br col
		command embed hr img input isindex keygen link meta
		param source track wbr
	'.split(/\s+/)

	TAG = 0
	TEXT = 1

	tagRegExp = /<([\w-]+)\s*((?:[^>]+=("|').*?\3|[^>]+)\s*)*>|<\/([\w-]+)>/img
	attrsRegExp = /(\S+?)\s*=\s*(?:(?:("|')(.*?)\2)|(\S+))|(\S+)/img
	dotClassRegExp = /^\.(.+)/


	constructor: ->
		@DOM = require('ui-js/dom/')
		return


	parse: (html)->
		html = html + ''
		context = @DOM.createElement('tmp')
		tokens = @getTokens(html)

		for token, index in tokens
			value = token.value
			type = token.type

			switch type
				when TEXT then context.append(@DOM.createText(value))
				when TAG
					if token.open
						node = @DOM.createElement(value, token.attrs)
						context.append(node)
						unless value in SINGLE_TAGS
							context = node
					else
						unless value in SINGLE_TAGS
							context = context.parent

		nodes = context.children.slice()
		for node in nodes then node.remove()
		return nodes



	getTokens: (html)->
		prevEndIndex = 0
		tokens = []

		html.replace tagRegExp, (match, openTag, attrs, quote, closeTag, index)=>
			if index > prevEndIndex then tokens.push
				type: TEXT
				value: html.slice(prevEndIndex, index)

			if openTag then tokens.push
				type: TAG
				open: yes
				value: openTag
				attrs: @parseAttrs(attrs)

			else if closeTag then tokens.push
				type: TAG
				open: no
				value: closeTag

			prevEndIndex = index + match.length
			return

		if html.length > prevEndIndex then tokens.push
			type: TEXT
			value: html.slice(prevEndIndex, html.length)

		return tokens


	parseAttrs: (attrs)->
		attrsObj = {}
		dotClasses = []

		attrs?.replace attrsRegExp, (match, name, quote, value, value2, name2)->
			value = value ? value2 ? ''
			name = name ? name2
			if dotClassRegExp.test(name) and not value
				dotClassName = name.match(dotClassRegExp)[1]
				dotClasses.push(dotClassName)
				return
			attrsObj[name] = value
			return

		if dotClasses.length
			dotClassesStr = dotClasses.join(' ')
			if attrsObj['class']
				attrsObj['class'] += " #{dotClassesStr}"
			else
				attrsObj['class'] = dotClassesStr

		return attrsObj



