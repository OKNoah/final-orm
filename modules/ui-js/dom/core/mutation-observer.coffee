Map = require('ui-js/polyfill/map') 


module.exports = class MutationObserver

	constructor: (@root)->
		@root.observe(@)
		@mutations = new Map()
		@has = no
		return


	initMutation: (node)->
		@has = yes
		unless @mutations.has(node)
			mutation = node.createMutation()
			@mutations.set(node, mutation)
			return mutation
		return @mutations.get(node)


	yield: ->
		result = @mutations
		@mutations = new Map()
		@has = no
		return result
	
		