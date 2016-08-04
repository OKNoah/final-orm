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
		@childTrees = []
		@expAttributes = {}

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
			return (node, component, scope)->
				unless returns? then returns = []
				return new directive(node, component, scope, returns...)

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


	init: (node, component, scope = {})->
		if @isTextNode
			if @hasTextExp then @initTextExp(node, component, scope)
			return component

		if @SubComponent
			subComponent = @SubComponent.init node, component.app, @, component, scope, (instance)=>
				@initLinks(instance, scope)
				@initProps(instance, component, scope)
		else
			@initLinks(node, scope)
			@initProps(node, component, scope)

		@initClasses(node, component, scope)
		@initExpAttributes(node, component, scope)
		@initEvents(node, component, scope, subComponent)
		@initChildren(node, component, scope)
		@initDirectives(node, component, scope)

		return component


	initChildren: (node, component, scope)->
		childNodes = node.children.slice()
		for child, index in @childTrees
			childNode = childNodes[index]
			child.init(childNode, component, scope)
		return


	initDirectives: (node, component, scope)->
		directives = for directive in @directives
			directive(node, component, scope)
		node.on 'destroy', ->
			for directive in directives
				directive.destructor?()
			return
		return


	initLinks: (target, scope)->
		for link in @links
			scope[link] = target
		return


	initEvents: (node, component, scope, subComponent)->
		for own eventName, eventData of @events then do(eventData)=>
			node.on eventName, (event)->
				if event instanceof Event
					if eventData.prevent
						event.prevent()
					if eventData.own and not event.own
						return

				if eventData.exp
					scope['$event'] = event
					scope['this'] = subComponent or node
					ui.eval(component, eventData.exp, scope)
					delete scope['$event']
					delete scope['this']
				return
		return


	initClasses: (node, component, scope)->
		for own className, exp of @classes
			node.bindClass(className, exp, component, scope)
		return


	initProps: (target, component, scope)->
		for own prop, exp of @props then do (prop, exp)=>
			dataBind = ui.bind(target, prop, component, exp, scope)
			target.on 'destroy', -> dataBind.destroy()
		return


	initTextExp: (node, component, scope)->
		exp = node.value
		ui.watch component, exp, (value)=>
			node.value = value
		, scope
		return


	initExpAttributes: (node, component, scope)->
		for own name, exp of @expAttributes then do(name)->
			ui.watch component, exp, (value)->
				node.attr(name, value)
			, scope
		return



