module.exports = class ShadowStyle 

	cssBlockRegExp = /([\s\S]+?)\s*(\{[\s\S]*?})/img
	partsRegExp = /([^,]+)/img


	@compile: (style)->
		if typeof style is 'function' then return style
		style = style.toString()
		return @createStyleGenerator(style)


	@replace: (selector, id, components = [])->
		childParts = selector.split(/\s+|>/)
		lastChildPart = childParts[childParts.length - 1]

		unless /:host/.test(lastChildPart)
			lastChildPart = lastChildPart.replace /^(.+?)(:.+)?$/, "$1[c#{id}]$2"
			childParts[childParts.length - 1] = lastChildPart
			selector = childParts.join(' ')

		selector = selector.replace(/:host/img, "[h#{id}]")
		return selector


	@createStyleGenerator: (style)->
		style = style.replace(/\s*(\r|\n|\r\n)\s*/img, '')
		style = style.replace(/"/img, '\\"')

		style = style.replace cssBlockRegExp, (match, selector, rules)->
			selector = selector.replace partsRegExp, '" + replace("$1", id, components) + "'
			return selector + rules

		generatorArgs = 'id, components'
		generatorBody = "var replace = #{@replace}; return \"#{style}\""
		return new Function(generatorArgs, generatorBody)




