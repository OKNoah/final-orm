module.exports = new class Keyboard 

	ALIASES:
		ENTER: 13
		SHIFT: 16
		CTRL: 17
		ALT: 18
		ESC: 27
		TAB: 9
		SPACE: 32
		UP: 38
		DOWN: 40
		LEFT: 37
		RIGHT: 39
		DEL: 46
		DELETE: 46
		HOME: 36
		END: 35
		PAGEUP: 33
		PAGEDOWN: 34


	constructor: ->
		@pushedKeys = {}
		@handlers = []
		window.addEventListener('keydown', @onKeyDown)
		window.addEventListener('keyup', @onKeyUp)
		return


	onKeyDown: (event)=>
		keyCode = event.keyCode
		@pushedKeys[keyCode] = yes
		@trigger()
		return


	onKeyUp: (event)=>
		keyCode = event.keyCode
		delete @pushedKeys[keyCode]
		return


	trigger: ->
		for handler in @handlers
			keys = handler.keys
			callback = handler.callback
			allMatch = keys.every (key)=> @pushedKeys[key]
			if allMatch then callback()
		return


	on: (pattern, callback)->
		for compo in pattern.toUpperCase().split(',')
			match = compo.match(/\w+/img)
			keys = match.map (key)=> @ALIASES[key] ? key.charCodeAt()
			@handlers.push({keys, callback})
		return


