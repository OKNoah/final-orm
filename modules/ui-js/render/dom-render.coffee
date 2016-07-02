animationFrame = require('ui-js/polyfill/animation-frame')
ArrayObserver = require('ui-js/data-bind/array-observer')
MutationObserver = require('ui-js/dom/core/mutation-observer')
HTMLRender = require('./html-render')
Event = require('ui-js/dom/core/event')
Selection = require('./selection')
DOM = require('ui-js/dom')


module.exports = class DOMRender


	constructor: (@nodeRoot, @container = document.body)->
		@mutationsObserver = new MutationObserver(@nodeRoot)
		@realRoot = null
		@htmlRender = new HTMLRender(@nodeRoot)
		@selection = new Selection()
		@range = document.createRange()
		@init()
		@frame()
		@initHandlers()
		return


	init: ->
		renderResult = @renderNode(@nodeRoot)
		@container.innerHTML = renderResult.html
		@realRoot = @container.children[0]
		@linkRenderResult(@realRoot, renderResult)
		return


	frame: ->
		if @mutationsObserver.has then @renderUpdates()
		animationFrame => @frame()
		return


	renderNode: (node, shadowOnly = off)->
		return @htmlRender.renderNode(node, shadowOnly)


	renderUpdates: ->
		mutations = @mutationsObserver.yield()
		#console.time 'render updates'
		@selection.save()
		mutations.forEach (mutation, node)=>
			@updateNode(mutation, node)
		@selection.restore()
		#console.timeEnd 'render updates'
		return


	updateNode: (mutation, node)->
		if node.host then node = node.host
		realNode = node.realNode

		unless realNode then return # TODO

		switch node.nodeType
			when 'text' then @updateText(node, realNode)
			when 'comment' then @updateComment(node, realNode)
			when 'element' then @updateElement(node, realNode, mutation)
		return


	getHost: (node)->
		context = node
		while context
			if context.host then return context.host
			context = context.parent or context.shadowRoot
		return null


	updateText: (node, realNode)->
		realNode.nodeValue = node.value
		return


	updateComment: (node, realNode)->
		realNode.nodeValue = node.value
		return


	updateElement: (node, realNode, mutation)->
		isContent = node.tag is 'content'

		if mutation.childrenChanged or isContent
			if host = @getHost(node)
				@updateChildren(host, host.realNode, yes)
			else
				@updateChildren(node, node.realNode)

		if isContent then return

		mutation.changedAttrs.forEach (name)->
			realNode.setAttribute(name, node.attrs[name])

		mutation.removedAttrs.forEach (name)->
			realNode.removeAttribute(name, node.attrs[name])

		mutation.changedStyles.forEach (name)->
			realNode.style[name] = node.style[name]

		if node.tag is 'input'
			if mutation.wasReset
				@resetInputValue(node, realNode)
			else if mutation.valueChanged
				@updateInputValue(node, realNode)
		return


	updateInputValue: (node, realNode)->
		prop = switch node.type
			when 'checkbox' then 'checked'
			else
				'value'
		realNode[prop] = node.value
		return


	resetInputValue: (node, realNode)->
		tmp = realNode.type
		realNode.type = 'text'
		@updateInputValue(node, realNode)
		realNode.type = tmp
		@updateInputModel(node, realNode)
		return


	updateInputModel: (node, realNode)->
		if node.type is 'file'
			node.setFiles(realNode.files)
			return

		prop = switch node.type
			when 'checkbox' then 'checked'
			else
				'value'
		node.value = realNode[prop]
		return


	updateChildren: (node, realNode, needChildren = off, renderResult)->
		renderResult = renderResult or @renderNode(node, yes)
		oldRenderResult = realNode.renderResult
		realNode.renderResult = renderResult

		oldChildNodes = oldRenderResult.children.map (re)-> re.node
		newChildNodes = renderResult.children.map (re)-> re.node

		splices = ArrayObserver.diff(newChildNodes, oldChildNodes)

		for splice in splices
			if splice.removed.length
				@removeChildSplice(realNode, splice)
			if splice.addedCount
				@insertChildSplice(newChildNodes, realNode, splice)

		if needChildren
			for childRenderResult, index in renderResult.children
				child = childRenderResult.node
				realChild = realNode.childNodes[index]
				@updateChildren(child, realChild, on, childRenderResult)
		return


	removeChildSplice: (realNode, splice)->
		index = splice.index
		count = splice.removed.length
		while count--
			realChild = realNode.childNodes[index]
			realNode.removeChild(realChild)
		return


	insertChildSplice: (newChildNodes, realNode, splice)->
		fragment = @createSpliceFragment(newChildNodes, splice)
		relChild = realNode.childNodes[splice.index]
		realNode.insertBefore(fragment, relChild)
		return


	createSpliceFragment: (newChildNodes, splice)->
		html = ''
		renderResults = []
		from = splice.index
		to = from + splice.addedCount

		for index in [from...to]
			child = newChildNodes[index]
			renderResult = @renderNode(child)
			renderResults.push(renderResult)
			html += renderResult.html

		fragment = @range.createContextualFragment(html)
		@splitTextNodes(fragment, {children: renderResults})

		for renderResult, index in renderResults
			realChild = fragment.childNodes[index]
			@linkRenderResult(realChild, renderResult)

		return fragment


	linkRenderResult: (realNode, renderResult)->
		if realNode.childNodes.length isnt renderResult.children.length
			@splitTextNodes(realNode, renderResult)

		node = renderResult.node
		node.init(realNode)
		realNode.renderResult = renderResult

		if node.tag is 'input' then @updateInputValue(node, realNode)

		for childRenderResult, index in renderResult.children
			realChild = realNode.childNodes[index]
			@linkRenderResult(realChild, childRenderResult)
		return


	splitTextNodes: (realNode, renderResult)->
		for textGroup in @createCloseTextNodes(renderResult)
			startIndex = textGroup.startIndex
			fragment = textGroup.fragment
			relText = realNode.childNodes[startIndex]
			realNode.insertBefore(fragment, relText)
			realNode.removeChild(relText)
		return


	createCloseTextNodes: (renderResult)->
		types = renderResult.children.map (child)-> child.node.nodeType

		closeTextGroups = []
		index = 0

		while type = types[index]
			nextType = types[index + 1]
			if type is 'text' and nextType is 'text'

				fragment = document.createDocumentFragment()
				startIndex = index

				while types[index] is 'text'
					text = renderResult.children[index]
					textNode = document.createTextNode(text.node.value)
					fragment.appendChild(textNode)
					index++
				closeTextGroups.push({fragment, startIndex})

			index++

		return closeTextGroups


	initHandlers: ->
		for eventName in @getEventNames() then do (eventName)=>
			@container.addEventListener eventName, (realEvent)=>
				realNode = realEvent.target
				virtualNode = realNode.renderResult?.node

				if virtualNode and eventName in ['input', 'change']
					@updateInputModel(virtualNode, realNode)

				@emitEvent(eventName, realNode, virtualNode, realEvent)
			, on
		return


	emitEvent: (eventName, realNode, virtualNode, realEvent)->
		realContext = realNode

		while realContext
			virtualTarget = realContext.renderResult?.node
			if virtualTarget and virtualTarget.hasEventHandlers(eventName)
				event = new Event(eventName, virtualNode, virtualTarget, realContext, realEvent)
				event.emit()
				if event.stopped then return

			realContext = realContext.parentNode
		return


	getEventNames: ->
		eventNames = []
		for key of document when key.indexOf('on') is 0
			eventName = key.slice(2)
			eventNames.push(eventName)
		return eventNames


