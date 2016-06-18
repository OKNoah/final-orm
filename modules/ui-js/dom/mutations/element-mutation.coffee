NodeMutation = require('./node-mutation') 


module.exports = class ElementMutation extends NodeMutation


	constructor: ->
		super
		@changedAttrs = new Set()
		@changedStyles = new Set()
		@removedAttrs = new Set()
		return

		
	changeStyle: (name)->
		@changedStyles.add(name)
		return


	changeAttribute: (name)->
		@changedAttrs.add(name)
		@removedAttrs.delete(name)
		return


	removeAttribute: (name)->
		@changedAttrs.delete(name)
		@removedAttrs.add(name)
		return


