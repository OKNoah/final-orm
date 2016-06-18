Element = require('./element') 
InputMutation = require('../mutations/input-mutation')


module.exports = class Input extends Element


	Object.defineProperty @prototype, 'type',
		get: -> @type_
		set: (type)-> @setType(type)
		configurable: on


	Object.defineProperty @prototype, 'value',
		get: -> @value_
		set: (value)-> @setValue(value)
		configurable: on


	Object.defineProperty @prototype, 'multiple',
		get: -> @multiple_
		set: (value)-> @setMultiple(value)
		configurable: on


	constructor: ->
		super
		@value = ''
		@type = @attr('type')
		@multiple_ = @attr('multiple')
		return


	setMultiple: (value)->
		@multiple_ = !!value
		if @multiple_ then @attr('multiple', 'true')
		else @removeAttr('multiple')
		return


	reset: ->
		@setDefaultValue_()
		@mutate (mutation)-> mutation.needReset()
		@emit('change')
		return


	setDefaultValue_: ->
		switch @type_
			when 'text' then @value_ = ''
			when 'password' then @value_ = ''
			when 'checkbox' then @value_ = false
			when 'file'
				if @value_ instanceof Array
					@value_.splice(0, @value_.length)
				else
					@value_ = []
		return


	normalizeType_: (type)->
		unless type in ['text', 'password', 'checkbox', 'file']
			type = 'text'
		return  type


	setType: (type)->
		@type_ = @normalizeType_(type)
		@setDefaultValue_()
		@attr('type', @type_)
		return


	setFiles: (fileList)->
		@value_.splice(0, @value_.length, fileList...)
		return


	setValue: (value)->
		switch @type_
			when 'text' then @value_ = value + ''
			when 'password' then @value_ = value + ''
			when 'checkbox' then @value_ = !!value
			when 'file' then return
		@mutate (mutation)-> mutation.changeValue()
		return


	createMutation: ->
		return new InputMutation(@)


	append: ->
		throw Error '<input> element cannot have child nodes'
		return


	prepend: ->
		throw Error 'input element cannot have children'
		return

		