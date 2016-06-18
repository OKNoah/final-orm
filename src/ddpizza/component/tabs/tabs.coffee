########################################
# Tabs
########################################
module.exports.Tabs = class Tabs

	@selector: 'tabs'
	@styles: [require('./tabs.styl')]
	@template: "
		<div .titles>
			<content select='tab title'></content>
		</div>

		<div .content>
			<content></content>
		</div>
	"

	constructor: ->
		@tabs = []
		return


	add: (tab)->
		@tabs.push(tab)
		if @tabs.length is 1
			@activateByIndex(0)
		return


	activate: (targetTab)->
		targetIndex = @tabs.indexOf(targetTab)
		@activateByIndex(targetIndex)
		return


	activateByIndex: (targetIndex)->
		for tab, index in @tabs
			if index < targetIndex
				tab.toPrev()
			else if index > targetIndex
				tab.toNext()
			else
				tab.toActive()
		return


########################################
# Tab
########################################
module.exports.Tab = class Tab

	@selector: 'tab'
	@styles: [require('./tab.styl')]
	@template: "
		<content></content>
	"

	PREV: 1
	NEXT: 2
	ACTIVE: 3

	constructor: ->
		@status = @NEXT
		@tabs = @require('tabs')
		@bindClass '__prev', 'status is PREV'
		@bindClass '__next', 'status is NEXT'
		@bindClass '__active', 'status is ACTIVE'
		@tabs.add(@)
		return


	toPrev: ->
		@status = @PREV
		return


	toNext: ->
		@status = @NEXT
		return


	toActive: ->
		@status = @ACTIVE
		return


	destructor: ->
		@tabs.remove(@)
		return


	activate: ->
		@tabs.activate(@)
		return


########################################
# TabTitle
########################################
module.exports.TabTitle = class TabTitle

	@selector: 'title'
	@styles: [require('./tab-title.styl')]
	@template: "
		<content></content>
	"

	constructor: ->
		@tab = @require('tab')
		@on 'mousedown', (event)=> event.prevent()
		@on 'click', => @tab.activate()
		@bindClass '__active', 'tab.status is tab.ACTIVE'
		return



