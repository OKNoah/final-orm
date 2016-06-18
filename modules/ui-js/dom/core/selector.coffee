module.exports = class Selector 


	regExp = /(?:(\s*>\s*)|^|\s+)(\S+)/img

	subSelectorRegExp = ///
		([\w-]+)
		|\.([\w-]+)
		|#([\w-]+)
		|\[([\w-]+)(?:(\^|\$|\*|~|\|)?=('|")(.*?)\6)?]
	///img


	cache = {}


	constructor: (selectorText)->
		if cache[selectorText] then return cache[selectorText]
		@selectors = @parseSelector(selectorText)
		cache[selectorText] = @
		return


	parseSelector: (selector)->
		selectors = []
		for part in selector.trim().split(/\s*,\s*/)
			subSelectors = []
			part.replace regExp, (match, own, subSelector)=>
				subSelectors.push({own: !!own, selector: @parseSubSelector(subSelector)})
			selectors.push(subSelectors)
		return selectors


	parseSubSelector: (subSelector)->
		parsed = {tag: null, attrs: []}
		subSelector.replace subSelectorRegExp, (match, tag, className, id, attrName, attrMode, quote, attrValue)->
			if tag is '*' then tag = null
			if tag then parsed.tag = tag
			if className
				parsed.attrs.push({name: 'class', value: className, mode: 'word'})
			else if id
				parsed.attrs.push({name: 'id', value: id, mode: 'equals'})
			else if attrName
				if attrValue? then mode = switch attrMode
					when '^' then 'start'
					when '$' then 'end'
					when '*' then 'content'
					when '~' then 'word'
					when '|' then 'dash'
					else
						'equals'
				parsed.attrs.push({name: attrName, value: attrValue, mode: mode})
			return

		return parsed



	select: (element)->
		found = []

		for subSelectors in @selectors
			unless subSelectors.length then continue
			contextElements = [element]
			for subSelector in subSelectors
				newContextElements = []
				for contextElement in contextElements
					own = subSelector.own
					selector = subSelector.selector
					foundElements = @selectChildren(contextElement, selector, own)
					newContextElements.push(foundElements...)
				contextElements = newContextElements
				unless contextElements.length then break

			for contextElement in contextElements
				if found.indexOf(contextElement) is -1
					found.push(contextElement)

		return found


	selectChildren: (element, subSelector, own = no)->
		elements = []
		children = element.children
		if children then for child in children
			if @matchElement(child, subSelector)
				elements.push(child)
			unless own then elements.push(@selectChildren(child, subSelector)...)
		return elements


	matchElement: (element, subSelector)->
		if element.nodeType isnt 'element'
			return false

		if subSelector.tag and element.tag isnt subSelector.tag
			return false

		for attr in subSelector.attrs
			name = attr.name
			unless element.hasAttr(name) then return false
			value = '' + attr.value
			attrValue = '' + element.attrs.get(name)

			switch attr.mode
				when 'equals'
					unless value is attrValue then return false
				when 'start'
					unless attrValue.indexOf(value) is 0 then return false
				when 'end'
					index = attrValue.lastIndexOf(value)
					if index is -1 then return false
					unless index + value.length is attrValue.length then return false
				when 'content'
					index = attrValue.indexOf(value)
					if index is -1 then return false
				when 'word'
					words = attrValue.split(/\s+/img)
					unless value in words then return false
				when 'dash'
					words = attrValue.split(/-/img)
					unless words[0] is value then return false

		return true

