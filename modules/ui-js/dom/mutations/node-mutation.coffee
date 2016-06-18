module.exports = class NodeMutation 


	constructor: (node)->
		@oldChildState = []
		@childrenChanged = false
		return



	changeChildren: ->
		@childrenChanged = true
		return
		
		