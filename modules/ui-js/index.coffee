# core modules 
Component = require('ui-js/core/component')
Directive = require('ui-js/core/directive')
keyboard = require('ui-js/core/keyboard')
Promise = require('ui-js/core/promise')
EventEmitter = require('ui-js/core/event-emitter')

# data bind
ArrayObserver = require('ui-js/data-bind/array-observer')
ExpObserver = require('ui-js/data-bind/exp-observer')
DataBind = require('ui-js/data-bind/data-bind')
Exp = require('ui-js/data-bind/exp')

# directives
Draggable = require('ui-js/directives/draggable')
Html = require('ui-js/directives/html')
Pre = require('ui-js/directives/pre')
For = require('ui-js/directives/for')
If = require('ui-js/directives/if')

# virtual dom
DOM = require('ui-js/dom')

# renderers
DOMRender = require('ui-js/render/dom-render')

# polyfills
animationFrame = require('ui-js/polyfill/animation-frame')
immediate = require('ui-js/polyfill/immediate')


# main module
module.exports = window['ui'] = new class UI

	EventEmitter: EventEmitter
	Promise: Promise

	constructor: ->
		@directives = [Pre, For, If, Html, Draggable]
		@components = []
		@pipes = {}
		@dom = DOM
		@keyboard = keyboard
		return


	bootstrap: (MainComponent, Render = DOMRender, renderOptions...)->
		MainComponent = Component.create(MainComponent)

		@components = Component.compileComponents(@components)
		@directives = Directive.compileDirectives(@directives)

		host = DOM.createElement(MainComponent.selector)
		MainComponent.init(host)
		render = new Render(host, renderOptions...)
		return render


	directive: (directive)->
		@directives.push(directive)
		return


	component: (component)->
		@components.push(component)
		return


	pipe: (name, pipe)->
		return Exp.addPipe(name, pipe)


	watch: (context, exp, handler, locals, init = on)->
		return new ExpObserver(context, exp, handler, locals, init)


	watchArray: (arr, handler)->
		return  new ArrayObserver(arr, handler)


	diff: (arr, oldArr)->
		return ArrayObserver.diff(arr, oldArr)


	bind: (objL, expL, objR, expR, locals)->
		return new DataBind(objL, expL, objR, expR, locals)


	eval: (context, exp, locals)->
		exp = new Exp(exp)
		return exp(context, locals)


	set: (context, exp, value, locals)->
		exp = new Exp(exp)
		return exp.set(context, value, locals)


	frame: (handler, element)->
		return animationFrame(handler, element)


	immediate: (handler)->
		return immediate(handler)


	timeout: (handler, time)->
		if typeof time is 'function'
			[handler,time] = [handler, time]
		return setTimeout(handler, time)


	on: (event, handler)->
		return ui.dom.on(event, handler)


	init: (handler)->
		ui.dom.on('DOMContentLoaded', handler)
		return


	resize: (handler)->
		return ui.dom.on('resize', handler)


	imageInfo: (src, handler)->
		img = document.createElement('img')
		img.onload = ->
			info = {width: img.naturalWidth, height: img.naturalHeight}
			handler(info)
		img.src = src
		return
		
