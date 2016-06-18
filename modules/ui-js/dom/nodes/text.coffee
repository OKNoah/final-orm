Node = require('./node') 


module.exports = class Text extends Node


	Object.defineProperty @prototype, 'value',
		get: -> @value_
		set: (value)-> @setValue(value)


	constructor: (@value_ = '')->
		super
		@nodeType = 'text'
		return


	setValue: (value)->
		@value_ = value + ''
		@mutate()
		return


	clone: ->
		return new @constructor(@value)



