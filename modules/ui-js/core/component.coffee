Element = require('ui-js/dom/nodes/element')
ShadowStyle = require('./shadow-style')
Directive = require('./directive')
DOM = require('ui-js/dom')
Tree = require('./tree')


module.exports = class Component

	@tag = ''
	@template = ''
	@style = ''
	@components = []
	@directives = []

	@tree = null
	@initedComponents = null
	@compiledTemplate = ''
	@id = 0

	lastId = 0
	compiledComponents = []
	shadowStyles = new Map()


	@create: (Class)->
		if Class in compiledComponents then return Class
		@extend(Class)
		compiledComponents.push(compiledComponents)
		Class.initedComponents = []
		Class.isComponent = yes
		Class.id = lastId++
		Class.compile()
		return Class


	@extend: (Class)->
		for own key, value of @
			unless Class[key]? then Class[key] = value
		if Class.prototype
			for key, value of @prototype when key isnt 'constructor'
				Class.prototype[key] = value
		return Class


	@compile: ->
		@compileComponents()
		@compileDirectives()
		@compileTemplate()
		@compileStyle()
		return


	@compileComponents: ->
		@components = @components.map (Class)-> Component.create(Class)
		return


	@compileDirectives: ->
		@directives = @directives.map (Class)-> Directive.create(Class)
		return


	@compileTemplate: ->
		#		unless @template instanceof Element
		#			templateNode = DOM.createElement('template')
		#			templateNode.html(@template)
		#			@template = templateNode
		templateNode = DOM.createElement('template')
		templateNode.html(@template)

		@tree = new Tree(templateNode, @)
		@compiledTemplate = @tree.template
		return


	@compileStyle: ->
		unless shadowStyles.has(@)
			styleNode = document.createElement('style')
			styleNode.setAttribute('shadow-style', @tag)
			document.head.appendChild(styleNode)
			shadowStyles.set(@, styleNode)

		css = ''
		for shadowStyle in @_getStyles()
			components = [ui.components..., @components...]
			css += shadowStyle(@id, [ui.components..., @components...])

		styleNode = shadowStyles.get(@)
		styleNode.innerHTML = css
		return


	@_getStyles: ->
		styles = []
		context = @prototype
		while context
			constructor = context.constructor
			if constructor.hasOwnProperty('style')
				style = constructor.style
				shadowStyle = ShadowStyle.compile(style)
				styles.unshift(shadowStyle)
			context = Object.getPrototypeOf(context)
		return styles


	@getSubComponent: (node)->
		globalComponents = ui.components.filter (component)=>
			# отфильтруем глобальные компоненты от текущего, чтобы не было рекурсии
			return component isnt @

		components = globalComponents.concat(@components)

		for component in components
			tag = component.tag
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
		tag = if shadowPrefix then "ui-#{@tag}" else @tag
		return node.querySelectorAll(tag)


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
		scope = Object.create(ui.globals)

		@define(component, 'host', host)
		@define(component, 'scope', scope)
		@define(component, 'app', app or component)
		host.component = component

		# construct
		component.constructor()

		@tree.init(shadowRoot, component, scope)
		@initedComponents.push(component)

		host.one 'destroy', =>
			component.destructor?()
			index = @initedComponents.indexOf(component)
			@initedComponents.splice(index, 1)
			return

		return component


	@reloadStyle: ->
		@compileStyle()
		return


	@reloadTemplate: ->
		@compileTemplate()

		for component in @initedComponents.slice()
			host = component.host
			scope = component.scope
			host.destroyShadowRoot()

			children = @createTemplateNodes()
			shadowRoot = host.createShadowRoot(@id)
			shadowRoot.html(children)

			@tree.init(shadowRoot, component, scope)
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


	require: (tag)->
		match = tag.match /(.+?)(\?)?$/
		tag = match[1]
		optional = !!match[2]

		context = @host.parent
		while context
			if context.component?.constructor?.tag is tag
				return context.component
			context = context.parent
		if optional then return null
		throw Error "Not found parent component '#{tag}' for '#{@constructor.tag}'"
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
		return @host.bindClass(className, exp, @, @scope)


	bind: (path, exp)->
		return ui.bind(@, path, @, exp, @scope)


	watch: (exp, handler)->
		return ui.watch(@, exp, handler, null, off)
		
