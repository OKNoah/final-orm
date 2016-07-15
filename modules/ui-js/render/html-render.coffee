module.exports = class HtmlRender


	constructor: (@node)->
		return


	render: ->
		renderResult = @renderNode(@node)
		return renderResult.html


	renderNode: (node, shadowOnly = off, excludeNodes = [])->
		switch node.nodeType
			when 'element'
				return @renderElement(node, shadowOnly, excludeNodes)
			when 'text'
				return @renderText(node)
			when 'comment'
				return @renderComment(node)

		throw Error "Unknown node type #{node}"
		return


	getShadowId: (node)->
		context = node
		while context.parent
			context = context.parent
		return context.shadowId


	allowAttrRegExp = /^\w/

	renderElement: (node, shadowOnly, excludeNodes)->
		tag = node.tag
		#
		#		if tag is 'content'
		#			return @renderContentElement(node, shadowOnly, excludeNodes)

		content = ''
		renderResult = new RenderResult(node)
		contentRoot = node.shadowRoot or node

		attrs = ''
		node.eachAttrs (name, value)->
			unless allowAttrRegExp.test(name) then return
			attrs += " #{name}=\"#{value}\""

		style = node.style.toString()
		if style then attrs += " style=\"#{style}\""

		shadowId = @getShadowId(node)
		if shadowId? then attrs += " c#{shadowId}"

		if node.shadowRoot
			hostShadowId = node.shadowRoot.shadowId
			attrs += " h#{hostShadowId}"
			tag = "ui-#{tag}"


		for child in contentRoot.children
			if child.nodeType is 'comment'
				continue
			else if child.tag is 'content'
				for childRenderResult in @renderContentElement(child, shadowOnly, excludeNodes)
					renderResult.appendChild(childRenderResult)
					content += childRenderResult.html
			else
				if child in excludeNodes then continue
				childRenderResult = @renderNode(child, shadowOnly, excludeNodes)
				if childRenderResult
					renderResult.appendChild(childRenderResult)
					content += childRenderResult.html

		renderResult.html = "<#{tag}#{attrs}>#{content}</#{tag}>"
		return renderResult


	renderText: (node)->
		html = node.value + ''
		return new RenderResult(node, html)


	renderComment: (node)->
		html = "<!-- #{node.value} -->"
		return new RenderResult(node, html)


	renderContentElement: (node, shadowOnly, excludeNodes)->
		renderResults = []
		host = @getHost(node)
		selector = node.attr('select')

		if selector
			for foundNode in host.select(">#{selector}")
				if foundNode.nodeType is 'comment' then continue
				if foundNode in excludeNodes then continue
				renderResult = @renderNode(foundNode, shadowOnly, excludeNodes)
				renderResults.push(renderResult)
				@markAsExcluded(foundNode, excludeNodes)

		else
			for child in host.children
				if child.nodeType is 'comment' then continue
				if child in excludeNodes then continue
				renderResult = @renderNode(child, shadowOnly, excludeNodes)
				renderResults.push(renderResult)
				@markAsExcluded(child, excludeNodes)

		return renderResults



	markAsExcluded: (node, excludeNodes)->
		excludeNodes.push(node)
		for child in node.children
			@markAsExcluded(child, excludeNodes)
		return


	getHost: (node)->
		context = node
		while context = context.parent
			if context.host then return context.host
		console.error 'not found host node for <content>', node
		return


class RenderResult

	constructor: (@node, @html)->
		@children = []
		return

	toString: ->
		return @html


	appendChild: (renderResult)->
		@children.push(renderResult)
		return


