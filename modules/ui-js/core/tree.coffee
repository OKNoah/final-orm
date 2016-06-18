Exp = require('ui-js/data-bind/exp') 
Event = require('ui-js/dom/core/event')


module.exports = class Tree


	eventRegExp = /^\((\()?(!?)(.+?)\)?\)$/
	directiveRegExp = /^\*(\S+)$/
	propRegExp = /^\[(\S+)]$/
	linkRegExp = /^#(\S+)$/
	classRegExp = /^\.(\S+)$/


	constructor: (@template, @Component)->
		if @template.nodeType is 'text'
			@isTextNode = yes
			@hasTextExp = Exp.test(@template.value)
			return

		@classes = {}
		@events = {}
		@props = {}
		@links = []
		@directives = []
		@expAttributes = {}
		@childTrees = []

		hasTerminal = @compileDirectives()
		if hasTerminal then return

		@SubComponent = @Component.getSubComponent(@template)

		@compileAttributes()
		@compileChildTrees()
		return


	create: (template)->
		return new Tree(template, @Component)


	replace: (node)->
		@template.replace(node)
		@template = node
		return


	compileDirectives: ->
		if @template.nodeType isnt 'element' then return
		directives = @getDirectives()
		directives = @sortDirectives(directives)
		directives = @filterDirectives(directives)
		hasTerminal = @directivesHasTerminal(directives)

		# compile
		@directives = directives.map (directive)=>
			returns = directive.compile?(@template, @)
			return (node, component, locals)->
				unless returns? then returns = []
				return new directive(node, component, locals, returns...)

		return hasTerminal


	getDirectives: ->
		directives = []
		@template.eachAttrs (name, value)=>
			if directiveRegExp.test(name)
				directive = name.match(directiveRegExp)[1]
				Directive = @Component.getDirective(directive)
				if Directive then directives.push Directive
		return directives


	sortDirectives: (directives)->
		directives.sort (a, b)-> a.priority < b.priority
		return directives


	filterDirectives: (directives)->
		filtered = []
		for directive in directives
			filtered.push(directive)
			if directive.terminal then break
		return filtered


	directivesHasTerminal: (directives)->
		return directives.some (directive)-> directive.terminal


	compileAttributes: ->
		if @template.nodeType isnt 'element' then return

		@template.eachAttrs (name, value)=>
			if eventRegExp.test(name)
				matches = name.match(eventRegExp)
				event = matches[3]
				@events[event] =
					own: !!matches[1]
					prevent: !!matches[2]
					exp: value

#				console.log @events[event]
			else if classRegExp.test(name)
				className = name.match(classRegExp)[1]
				@classes[className] = value

			else if propRegExp.test(name)
				prop = name.match(propRegExp)[1]
				@props[prop] = value

			else if linkRegExp.test(name)
				link = name.match(linkRegExp)[1]
				@links.push(link)

			else if Exp.test(value)
				@expAttributes[name] = value
		return


	compileChildTrees: ->
		for child in @template.children
			@childTrees.push(new Tree(child, @Component))
		return


	init: (node, component, locals = {})->
		if @isTextNode
			if @hasTextExp then @initTextExp(node, component, locals)
			return component

		if @SubComponent
			subComponent = @SubComponent.init(node, component.app)
			@initLinks(subComponent, locals)
			@initProps(subComponent, component, locals)
		else
			@initLinks(node, locals)
			@initProps(node, component, locals)

		@initClasses(node, component, locals)
		@initExpAttributes(node, component, locals)
		@initEvents(node, component, locals, subComponent)
		@initChildren(node, component, locals)
		@initDirectives(node, component, locals)

		return component


	initChildren: (node, component, locals)->
		childNodes = node.children.slice()
		for child, index in @childTrees
			childNode = childNodes[index]
			child.init(childNode, component, locals)
		return


	initDirectives: (node, component, locals)->
		directives = for directive in @directives
			directive(node, component, locals)
		node.on 'destroy', ->
			for directive in directives
				directive.destructor?()
			return
		return


	initLinks: (target, locals)->
		for link in @links
			locals[link] = target
		return


	initEvents: (node, component, locals, subComponent)->
		for own eventName, eventData of @events then do(eventData)=>
			node.on eventName, (event)->
				if event instanceof Event
					if eventData.prevent
						event.prevent()
					if eventData.own and not event.own
						return

				if eventData.exp
					locals['$event'] = event
					locals['this'] = subComponent or node
					ui.eval(component, eventData.exp, locals)
					delete locals['$event']
					delete locals['this']
				return
		return


	initClasses: (node, component, locals)->
		for own className, exp of @classes
			node.bindClass(className, exp, component, locals)
		return


	initProps: (target, component, locals)->
		for own prop, exp of @props then do (prop, exp)=>
			dataBind = ui.bind(target, prop, component, exp, locals)
			target.on 'destroy', -> dataBind.destroy()
		return


	initTextExp: (node, component, locals)->
		exp = node.value
		ui.watch component, exp, (value)=>
			node.value = value
		, locals
		return


	initExpAttributes: (node, component, locals)->
		for own name, exp of @expAttributes then do(name)->
			ui.watch component, exp, (value)->
				node.attr(name, value)
			, locals
		return



