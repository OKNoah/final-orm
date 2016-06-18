module.exports = class Selection

	constructor: ->
		@selection = getSelection() 
		@activeElement = null
		@selectable = false
		@selectionStart = 0
		@selectionEnd = 0
		@ranges = []
		return


	clear: ->
		@anchorNode = null
		@anchorOffset = null
		@focusNode = null
		@focusOffset = null
		return


	save: ->
		@activeElement = document.activeElement
		@selectable = @isSelectable(@activeElement)

		if @selectable
			@selectionStart = @activeElement.selectionStart
			@selectionEnd = @activeElement.selectionEnd
		else
			@ranges = for index in [0...@selection.rangeCount]
				range = @selection.getRangeAt(index)
				startContainer: range.startContainer
				startOffset: range.startOffset
				endContainer: range.endContainer
				endOffset: range.endOffset
		return


	restore: ->
		if @selectable
			if @activeElement isnt document.activeElement
				@activeElement.focus()
			@activeElement.selectionStart = @selectionStart
			@activeElement.selectionEnd = @selectionEnd
		else
			return ## TODO bug
		#			@selection.removeAllRanges()
		#			for rangeData in @ranges
		#				range = document.createRange()
		#				startOffset = Math.min(rangeData.startContainer.length, rangeData.startOffset)
		#				range.setStart(rangeData.startContainer, startOffset)
		#				endOffset = Math.min(rangeData.endContainer.length, rangeData.endOffset)
		#				range.setEnd(rangeData.endContainer, endOffset)
		#				@selection.addRange(range)
		return


	isSelectable: (node)->
		unless node then return false
		if node.tagName is 'INPUT'
			return /^(text|search|password|tel|url)$/.test(node.type)
		if node.tagName is 'TEXTAREA'
			return true
		return false

