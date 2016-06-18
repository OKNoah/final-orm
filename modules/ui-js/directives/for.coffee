DOM = require('ui-js/dom') 


module.exports = class For

	regExp = /^\s*(?:([\w$]+)(?:,\s*([\w$]+))?\s+in\s+)?(.+?)\s*$/

	@attribute: 'for'
	@priority: 1000
	@terminal: on


	@compile: (template, tree)->
		exp = template.attr('*for')
		template.removeAttr('*for')

		comment = DOM.createComment(" *for #{exp} ")
		tree.replace(comment)

		match = exp.match(regExp)
		itemName = match[1]
		indexName = match[2]
		exp = match[3]

		subTree = tree.create(template)
		return [subTree, itemName, indexName, exp]


	constructor: (@label, @component, @locals, @subThree, @itemName, @indexName, exp)->
		@array = []
		@iterations = []
		@observer = null
		ui.watch(@component, exp, @changeArray, @locals)
		return


	destructor: ->
		@observer?.destroy()
		return


	changeArray: (newArray = [])=>
		if typeof newArray is 'number'
			if newArray <= 0 then newArray = []
			else newArray = [0...newArray]
		else if typeof newArray is 'string' and not isNaN(newArray)
			newArray = +newArray
			newArray = [0...newArray]
		else unless newArray instanceof Array
			throw Error 'invalid *for array'

		splices = ui.diff(newArray, @array)
		@array = newArray

		if splices.length then @renderSplices(splices)
		@observer?.destroy()
		@observer = ui.watchArray(@array, @renderSplices)
		return


	renderSplices: (splices)=>
		for splice in splices
			@spliceIterations(splice)
		@updateIndexes()
		return


	updateIndexes: ->
		unless @indexName then return
		for iteration, index in @iterations
			iteration.locals[@indexName] = index
		return


	spliceIterations: (splice)->
		startIndex = splice.index
		addedCnt = splice.addedCount
		removedCnt = splice.removed.length
		newIterations = []
		content = []

		cnt = 0
		while cnt < addedCnt
			index = startIndex + cnt
			iteration = new Iteration(@subThree, @component, @locals)
			iteration.locals[@itemName] = @array[index]
			newIterations.push(iteration)
			content.push(iteration.node)
			content.push(iteration.end)
			cnt++

		@insertIterationsContent(startIndex, content)

		removed = @iterations.splice(startIndex, removedCnt, newIterations...)
		for iteration in removed then iteration.destroy()
		for iteration in newIterations then iteration.init()
		return


	insertIterationsContent: (index, content)->
		if index is 0
			label = @label
		else if index > @iterations.length - 1
			label = @iterations[@iterations.length - 1].end
		else
			label = @iterations[index].end

		label.after(content)
		return


class Iteration


	constructor: (@subThree, @component, locals)->
		@locals = Object.create(locals)
		@node = @subThree.template.clone()
		@end = DOM.createComment(' *for iteration ')
		return


	init: (item)->
		@subThree.init(@node, @component, @locals)
		return


	destroy: ->
		@end.destroy(yes, yes)
		@node.destroy(yes, yes)
		return

