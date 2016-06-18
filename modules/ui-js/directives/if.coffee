Tree = require('ui-js/core/tree') 
DOM = require('ui-js/dom')


module.exports = class If


	@attribute: 'if'
	@priority: 600
	@terminal: on


	@compile: (template, tree)->
		comment = DOM.createComment(' *if ')
		tree.replace(comment)
		exp = template.attr('*if')
		template.removeAttr('*if')
		subTree = tree.create(template)
		return [subTree, exp]


	constructor: (@label, @component, @locals, @subThree, exp)->
		@node = null
		ui.watch(@component, exp, @changeState, @locals)
		return


	destructor: ->
		@destroy()
		return


	changeState: (state)=>
		if state then @create()
		else @destroy()
		return


	create: ->
		if @node then return
		@node = @subThree.template.clone()
		@label.after(@node)
		@subThree.init(@node, @component, @locals)
		return


	destroy: ->
		unless @node then return
		@node.destroy(yes, yes)
		@node = null
		return

