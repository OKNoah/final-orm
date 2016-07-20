EventEmitter = require('ui-js/core/event-emitter')
NodeMutation = require('../mutations/node-mutation')


module.exports = class Node extends EventEmitter

	Node.lastId = 0


	constructor: ->
		super
		@nodeId = Node.lastId++
		@realNode = null
		@parent = null
		@children = []
		@observers = []
		return


	init: (@realNode)->
		@emit('init', @realNode)
		return


	observe: (observer)->
		@observers.push(observer)
		return


	createMutation: ->
		return new NodeMutation(@)


	mutate: (handler)->
		observers = @getObservers()
		for observer in observers
			mutation = observer.initMutation(@)
			handler?(mutation)
		return


	getObservers: ->
		observers = []
		context = @
		while context
			observers.push(context.observers...)
			context = context.parent or context.host
		return observers


	destroy: (destroyChildren = yes, needRemove = no)->
		if destroyChildren
			for child in @children then child.destroy(yes, no)
		@emit('destroy')

		if needRemove then @remove()
		@removeAllEventHandlers()
		return


	clone: ->
		throw Error 'Node clone is a pure virtual method'
		return


	remove: ->
		@parent?.removeChild(@)
		return


	getIndex: ->
		return @parent.getChildIndex(@)


	append: (node)->
		node.remove()
		node.parent = @
		@children.push(node)
		@mutate (mutation)-> mutation.changeChildren()
		return


	appendTo: (node)->
		node.append(@)
		return


	prepend: (node)->
		node.remove()
		node.parent = @
		@children.unshift(node)
		@mutate (mutation)-> mutation.changeChildren()
		return


	prependTo: (node)->
		node.append(@)
		return


	insertBefore: (relChild, node)->
		node.remove()
		node.parent = @
		index = relChild.getIndex()
		@children.splice(index, 0, node)
		@mutate (mutation)-> mutation.changeChildren()
		return


	before: (node)->
		@parent.insertBefore(@, node)
		return


	insertAfter: (relChild, node)->
		if node instanceof Array
			arr = node
			index = relChild.getIndex()
			@children.splice(index + 1, 0, arr...)
			for node in arr
				node.remove()
				node.parent = @
		else
			node.remove()
			node.parent = @
			index = relChild.getIndex()
			@children.splice(index + 1, 0, node)
		@mutate (mutation)-> mutation.changeChildren()
		return


	after: (node)->
		@parent.insertAfter(@, node)
		return


	replaceChild: (child, newChild)->
		index = child.getIndex()
		@children[index] = newChild
		child.parent = null
		newChild.parent = @
		@mutate (mutation)-> mutation.changeChildren()
		return


	replace: (newNode)->
		@parent.replaceChild(@, newNode)
		return


	empty: ->
		for child in @children.slice()
			@removeChild(child)
		return


	removeChild: (child)->
		index = child.getIndex()
		@children.splice(index, 1)
		child.parent = null
		@mutate (mutation)-> mutation.changeChildren()
		return


	getChildIndex: (node)->
		return @children.indexOf(node)


	hasChild: (node)->
		return node.parent is @


