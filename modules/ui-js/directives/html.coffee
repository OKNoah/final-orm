#module.exports = class Html  
#
#	@attribute = 'html'
#
#	@compile: (template, tree)->
#		exp = template.attr('*html')
#		return [exp, tree]
#
#
#	constructor: (@node, @component, @scope, exp, @tree)->
#		ui.watch(@component, exp, @changeHtml, @scope)
#		return
#
#	destructor: ->
#		@destroyContent()
#		return
#
#	changeHtml: (html)=>
#		@destroyContent()
#		@node.html(html)
#		
#		#template = document.createElement('template')
#		#template.innerHTML = html
#		#@node.innerHTML = html
#		#subTree = @tree.create(template)
#		#subTree.init(@node, @component, @scope)
#		return
#
#
#	destroyContent: ->
#		console.log 'destroyContent'
#		#while @node.firstChild
#		#	ui.destroy(@node.firstChild)
#		return
#

