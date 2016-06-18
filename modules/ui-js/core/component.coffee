DOM = require('ui-js/dom') 
ShadowStyle = require('./shadow-style')
Directive = require('./directive')
Tree = require('./tree')


module.exports = class Component

	componentsById = {}

	@selector = ''
	@template = ''
	@styles = []
	@components = []
	@directives = []
	@attrs = []

	@tree = null
	@initedComponents = null
	@styleNode = null
	@compiledTemplate = ''
	@id = 0

	lastId = 0

	@generateId: ->
		return lastId++


	@create: (Class)->
		if componentsById[Class.id] then return Class

		for own key, value of @
			Class[key] = Class[key] or value

		if Class.prototype
			for key, value of @prototype when key isnt 'constructor'
				Class.prototype[key] = value

		id = @generateId()
		Class.id = id
		componentsById[id] = Class
		Class.initedComponents = []
		Class.compile()
		return Class


	@compileComponents: (components)->
		compiledComponents = []
		for component in components
			if typeof component is 'function'
				CompiledComponent = Component.create(component)
				compiledComponents.push(CompiledComponent)
			else
				for own key, value of component
					CompiledComponent = Component.create(value)
					compiledComponents.push(CompiledComponent)
		return compiledComponents


	@compile: ->
		@components = Component.compileComponents(@components)
		@directives = Directive.compileDirectives(@directives)
		@compileStyles()
		@compileTemplate()
		return


	@compileTemplate: ->
		templateNode = DOM.createElement('root')
		templateNode.html(@template)
		@tree = new Tree(templateNode, @)
		@compiledTemplate = @tree.template
		return


	@compileStyles: ->
		unless @styles
			if @styleNode
				document.head.removeChild(@styleNode)
				@styleNode = null
				return

		unless @styleNode
			@styleNode = document.createElement('style')
			document.head.appendChild(@styleNode)

		totalStylesCode = ''

		for style in @styles
			styleGenerator = ShadowStyle.compile(style)
			components = ui.components.concat(@components)
			totalStylesCode += styleGenerator(@id, components)

		@styleNode.innerHTML = totalStylesCode
		return


	@getSubComponent: (node)->
		globalComponents = ui.components.filter (component)=>
			# отфильтруем глобальные компоненты от текущего, чтобы не было рекурсии
			return component isnt @

		components = globalComponents.concat(@components)

		for component in components
			tag = component.selector
			if tag is node.tag then return component
		return null


	@isSubComponent: (node)->
		return !!@getSubComponent(node)


	@getDirective: (name)->
		for Dir in @directives
			if Dir.attribute is name
				return Dir
		for Dir in ui.directives
			if Dir.attribute is name
				return Dir
		return null


	@find: (node, shadowPrefix = off)->
		selector = if shadowPrefix then "ui-#{@selector}" else @selector
		return node.querySelectorAll(selector)


	@createTemplateNodes: ->
		return @compiledTemplate.clone().children


	@define: (component, prop, value)->
		Object.defineProperty component, prop,
			value: value
			writable: off
			enumerable: off
			configurable: on
		return


	@init: (host, app)->
		children = @createTemplateNodes()
		shadowRoot = host.createShadowRoot(@id)
		shadowRoot.html(children)

		component = Object.create(@prototype)
		locals = {}

		@define(component, 'host', host)
		@define(component, 'locals', locals)
		@define(component, 'app', app or component)

		host.component = component
		component.constructor()

		@tree.init(shadowRoot, component, locals)
		@initedComponents.push(component)

		host.one 'destroy', =>
			component.destructor?()
			index = @initedComponents.indexOf(component)
			@initedComponents.splice(index, 1)
			return

		return component


	@reloadStyle: ->
		@compileStyles()
		return


	@reloadTemplate: ->
		@compileTemplate()

		for component in @initedComponents.slice()
			host = component.host
			locals = component.locals
			host.destroyShadowRoot()

			children = @createTemplateNodes()
			shadowRoot = host.createShadowRoot(@id)
			shadowRoot.html(children)

			@tree.init(shadowRoot, component, locals)
		return


	@reload: ->
		@compile()
		for component in @initedComponents.slice()
			host = component.host
			app = component.app
			host.destroy(no)
			host.destroyShadowRoot()
			@init(host, app)
		return


	require: (name)->
		match = name.match /(.+?)(\?)?$/
		name = match[1]
		optional = !!match[2]

		context = @host.parent
		while context
			if context.component?.constructor?.selector is name
				return context.component
			context = context.parent
		if optional then return null
		throw Error "Not found parent component '#{name}' required in '#{@constructor.selector}'"
		return


	emit: (eventName, event)->
		@host.emit(eventName, event)
		return


	on: (eventName, handler)->
		@host.on(eventName, handler)
		return


	one: (eventName, handler)->
		@host.one(eventName, handler)
		return


	own: (eventName, handler)->
		@host.own(eventName, handler)
		return


	off: (eventName, handler)->
		@host.off(eventName, handler)
		return


	bindClass: (className, exp)->
		return @host.bindClass(className, exp, @, @locals)


	bind: (prop, exp)->
		return ui.bind(@, prop, @, exp, @locals)


	watch: (prop, handler)->
		return ui.watch(@, prop, handler, null, off)
		
