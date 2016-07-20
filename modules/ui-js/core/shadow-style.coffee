module.exports = class ShadowStyle

	cssBlockRegExp = /([\s\S]+?)\s*(\{[\s\S]*?})/img
	partsRegExp = /([^,]+)/img

	cache = {}

	@compile: (style)->
		if typeof style is 'function' then return style
		style = style.toString()
		if cache[style] then return cache[style]
		generator = @createStyleGenerator(style)
		generator.style = style
		cache[style] = generator
		return generator


	@replace: (selector, id, components = [])->
		componentTags = components.map (component)=> component.tag

		parts = selector.split(/\s+|>/).map (part, index, parts)=>
			# pseudo selector
			if index is parts.length - 1 and not /:host/.test(part)
				part = part.replace /^(.+?)(:.+)?$/, "$1[c#{id}]$2"
			# :host
			part = part.replace(/:host/img, "[h#{id}]")
			# child components
			part = part.replace /^[\w\-]+/, (tag)=>
				return if componentTags.indexOf(tag) isnt -1
					return "ui-#{tag}"
				return tag
			# return chanted part
			return part

		return parts.join(' ')


	@createStyleGenerator: (style)->
		style = style.replace(/\s*(\r|\n|\r\n)\s*/img, '')
		style = style.replace(/"/img, '\\"')

		style = style.replace cssBlockRegExp, (match, selector, rules)->
			selector = selector.replace partsRegExp, '" + replace("$1", id, components) + "'
			return selector + rules

		generatorArgs = 'id, components'
		generatorBody = "var replace = #{@replace}; return \"#{style}\""
		return new Function(generatorArgs, generatorBody)

