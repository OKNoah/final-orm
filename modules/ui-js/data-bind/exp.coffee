VAR_REF = '$$ref'
VAR_CONTEXT = '$$context' 
VAR_VALUE = '$$val'
VAR_LOCALS = '$$locals'
VAR_HELPERS = '$$helpers'


ALIASES =
	'and': '&&'
	'or': '||'
	'then': '?'
	'else': ':'
	'is': '=='
	'isnt': '!=='
	'not': '!'
	'yes': 'true'
	'on': 'true'
	'no': 'false'
	'off': 'false'
	'undefined': 'void 0'
	'typeof': 'typeof '
	'instanceof': 'instanceof '
	'@': 'this'
# не знаю костыль ли это, или оптимизация, в общем мы не парсим пробельные символы
# и при компиляции у нас все впритык друг к другу идет, а после instanceof нужен пробел
# по этому чтобы не усложнять парсинг я просто создал ему алиас с пробелом
# возможно подобные вещи так и нужно делать, пока не знаю


KEYWORDS =
	null: on
	var: on
	void: on
	typeof: on
	instanceof: on
	undefined: on
	true: on
	false: on


####################################
# Exp
####################################
module.exports = class Exp

	@cache: {}
	@pipes = {}

	constructor: (code)->
		unless code then throw Error 'exp is empty'
		if typeof code is 'function' then return code
		if Exp.cache[code] then return Exp.cache[code]

		if Exp.test(code)
			exp = createStringExp(code)
		else
			exp = createExp(code)

		Exp.cache[code] = exp
		return exp


	@addPipe: (name, pipe)->
		@pipes[name] = pipe
		return


	@pipe: (name, args...)->
		pipe = @pipes[name]
		unless pipe then throw Error "Pipe '#{name}' is not defined"
		return pipe(args...)


	@test: (code)->
		return /\{\{.*}}/.test(code)

	@parts: (code)->
		return code.split(/\{\{|}}/)

	@split: (code)->
		return @parts(code).map (part, index)->
			return if index % 2 then "{{#{part}}}" else part

	@getValue: (obj, exp)->
		exp = new Exp(exp)
		return exp(obj)

	@setValue: (obj, exp, value)->
		exp = new Exp(exp)
		exp.set?(obj, value)
		return value


createExp = (code)->
	tokens = new TokenList(code)
	exp = createGetter(tokens.compile())
	try exp.set = createSetter(tokens.compile(on))
	catch then exp.set = null

	exp.paths = tokens.getPaths()
	exp.isStatic = tokens.isStatic()
	exp.isExp = yes
	exp.isStringExp = no
	return exp


createGetter = (code)->
	args = "#{VAR_CONTEXT},#{VAR_LOCALS},#{VAR_HELPERS}"
	body = "var #{VAR_REF};if(!#{VAR_LOCALS})#{VAR_LOCALS}={};return #{code}"
	getter = new Function(args, body)
	return (context, locals)-> getter(context, locals, Exp)


createSetter = (code)->
	try
		args = "#{VAR_CONTEXT},#{VAR_VALUE},#{VAR_LOCALS},#{VAR_HELPERS}"
		body = "var #{VAR_REF};if(!#{VAR_LOCALS})#{VAR_LOCALS}={};return #{code}=#{VAR_VALUE}"
		setter = new Function(args, body)
		return (context, value, locals)-> setter(context, value, locals, Exp)
	catch
		return null


createStringExp = (code)->
	parts = Exp.parts(code)
	partsString = []
	isStatic = true
	paths = []

	for part, index in parts when part
		if index % 2 # code part
			tokens = new TokenList(part)
			partPaths = tokens.getPaths()
			paths.push(partPaths...)
			unless tokens.isStatic() then isStatic = false
			compiledPart = tokens.compile()
			partsString.push "(#{VAR_REF}=(#{compiledPart}),#{VAR_REF}!=null?#{VAR_REF}+'':'')"

		else # string part
			part = part.replace /'/img, "\\'"
			part = "'#{part}'"
			tokens = new TokenList(part)
			compiledPart = tokens.compile()
			partsString.push(compiledPart)

	result = partsString.join('+')

	exp = createGetter(result)
	exp.set = null
	exp.isStatic = isStatic
	exp.isExp = yes
	exp.paths = paths
	exp.isStringExp = yes
	return exp


####################################
# ParseError
####################################
class ParseError extends Error

	constructor: (message, type)->
		unless @ instanceof ParseError
			return new ParseError(message, type)
		@message = message
		@name = 'ParseError'
		@name += " #{type}" if type?


	toString: ->
		return "#{@name}: #{@message}"


####################################
# Token
####################################
class Token

	Token.regExp = ///
		(("|')(?:\\\2|[\s\S])*?\2)    # strings
		|(?:([$\w]+)\s*:)             # objest keys
		|(\d+)                        # numbers
		|([$\w]+)                     # words
		|(\+\+|\-\-)                  # crement
		|(\S)                         # other symbols
	///img


	constructor: (matches)->
		@value = matches[0]
		isString = matches[2]
		isKey = matches[3]
		isNumber = matches[4]
		isWord = matches[5]
		isCrement = matches[6]
		isSymbol = matches[7]

		@alias = ALIASES[@value] or null
		@isKey = !!isKey
		@isWord = !!isWord or @isKey
		@isCrement = !!isCrement
		@isString = !!isString
		@isNumber = !!isNumber
		@isLiteral = !!(@isString or @isNumber)
		@isSymbol = !!isSymbol
		@isVar = (@value is VAR_REF) or (@value is VAR_CONTEXT) or (@value is VAR_VALUE)
		@isKeyword = !!(KEYWORDS[@value] or ALIASES[@value])
		@isProp = !!((isWord and !@isKeyword and !@isKey and !@isVar) or (@value is '@'))
		@isOperator = !!(isSymbol or isCrement or @isKeyword) and not @isProp
		@isBracketStart = @match('[', '(', '{')
		return


	match: (values...)->
		for value in values
			return true if @value is value
		return false


	toString: ->
		return @value


	compile: ->
		if @isString
			return @value.replace /\n/img, '\\n'
		return @alias or @value


####################################
# TokenList
####################################
class TokenList extends Array

	constructor: (@code = null)->
		@structures = null
		if @code? then @parseCode(@code)
		return


	getPaths: ->
		paths = []
		for structure in @getStructures()
			structurePaths = structure.getPaths()
			paths.push(structurePaths...)
		return paths


	parseCode: (code)->
		code.replace Token.regExp, =>
			@push new Token(arguments)
		return


	indexOfValue: (value, index = 0)->
		while index < @length
			token = @[index]
			if token.value is value then return index
			index++
		return -1


	sequence: (index = 0, handler)->
		setIndex = (newIndex)->
			if newIndex < index then throw ParseError 'sequence setIndex set newIndex < index'
			index = newIndex

		while index < @length
			token = @[index]
			if handler(token, index, setIndex) is false then break
			index++
		return index


	slice: (start, end)->
		tokens = new TokenList()
		tokens.push(super(start, end)...)
		tokens.code = tokens.toString()
		return tokens


	prev: (index)->
		return @[index - 1]


	next: (index)->
		return @[index + 1]


	findStringEnd: (startToken, index)->
		endIndex = @indexOfValue(startToken.value, index + 1)
		if endIndex is -1 then throw ParseError @code, 'string not closed'
		return endIndex


	findBracketEnd: (startToken, index)->
		open = startToken.value
		close = ']' if open is '['
		close = ')' if open is '('
		close = '}' if open is '{'
		nesting = 0

		while index < @length
			token = @[index]

			if token.isQuote
				index = @findStringEnd(token, index)
				token = @[index]

			if token.value is open then nesting++
			if token.value is close then nesting--
			if nesting is 0 then return index
			index++

		throw ParseError @code, 'bracket not closed'


	findPathEnd: (index)->
		return @sequence index, (token, index, setIndex)=>
			if token.isProp then return true
			if token.value is '.' then return true
			if token.match('(', '[')
				setIndex @findBracketEnd(token, index)
				return true
			return false


	findOtherEnd: (index)->
		return @sequence index, (token)=>
			if token.isProp then return false
			if token.value is '|' then return false


	findPipeEnd: (index)->
		return @sequence index + 1, (token, index, setIndex)=>
			if token.isProp then return
			if token.value is '('
				endIndex = setIndex @findBracketEnd(token, index)
				setIndex(endIndex + 1)
			return false


	getStructures: ->
		if @structures then return @structures
		structures = []

		@sequence 0, (token, index, setIndex)=>
			if token.isProp
				endIndex = @findPathEnd(index)
				structures.push new PathStructure(@slice(index, endIndex))
				setIndex(endIndex - 1)
				return

			if token.value is '|'
				endIndex = @findPipeEnd(index)
				structures.push new PipeStructure(@slice(index + 1, endIndex))
				setIndex(endIndex - 1)
				return

			endIndex = @findOtherEnd(index)
			structures.push new Structure(@slice(index, endIndex))
			setIndex(endIndex - 1)
			return

		@structures = structures
		return structures


	toString: (separator = '')->
		values = @map (token)-> token.toString()
		return values.join(separator)


	compile: (setterMode = off)->
		structures = @getStructures()
		compiledCode = ''

		if setterMode
			if structures.length > 1
				throw Error 'Cant compile to setter'

			lastStructure = structures[structures.length - 1]
			if lastStructure.type isnt 'path'
				throw Error 'Cant compile to setter'

		for structure, index in structures
			forceSetter = off
			if structure.type is 'pipe'  then continue
			if structure.type is 'path'
				nextStructure = structures[index + 1]
				if nextStructure
					forceSetter = nextStructure.tokens.some (token)->
						return token.isCrement or token.value is '='

			compiledStructure = structure.compile(setterMode or forceSetter)
			if structure.type is 'path'
				nextStructure = structures[index + 1]
				if nextStructure instanceof PipeStructure
					compiledStructure = nextStructure.compile(compiledStructure)

			compiledCode += compiledStructure

		return compiledCode



	isStatic: ->
		structures = @getStructures()
		for structure in structures
			if structure.type is 'path' then return false
			if structure.type is 'pipe' then return false
		return true


	search: (value)->
		for token, index in @
			if token.value is value
				return index
		return -1


####################################
# Structure
####################################
class Structure

	constructor: (@tokens, @type = 'other')->
		return


	toString: ->
		return @tokens.toString()


	compile: ->
		string = ''
		for token in @tokens
			string += token.compile()
		return string


	getPaths: ->
		return []


####################################
# PipeStructure
####################################
class PipeStructure extends Structure

	constructor: (tokens)->
		super(tokens, 'pipe')
		@name = ''
		@args = null
		@parse(tokens)
		return

	parse: (tokens)->
		@name = tokens[0].value
		if tokens.length > 1
			@args = tokens.slice(2, -1)
		return


	getPaths: ->
		return @args?.getPaths() or []


	compile: (base)->
		if @args
			return "#{VAR_HELPERS}.pipe('#{@name}',(#{base}),#{@args.compile()})"
		else
			return "#{VAR_HELPERS}.pipe('#{@name}',(#{base}))"


####################################
# PathStructure
####################################
class PathStructure extends Structure

	constructor: (tokens)->
		super(tokens, 'path')
		@accessors = @parse(tokens)
		return


	getProps: ->
		props = []
		for accessor in @accessors
			if accessor.type is 'prop'
				prop = accessor.name.toString()
				props.push(prop)
		return props


	getPaths: ->
		return [@accessors.slice()]


	parse: (tokens)->
		accessors = []

		tokens.sequence 0, (token, index, setIndex)->
			if token.isProp
				nextToken = tokens.next(index)

				unless nextToken
					accessors.push new PathAccessor(token, 'prop')
				else switch nextToken.value
					when '.'
						accessors.push new PathAccessor(token, 'prop')
					when '('
						endIndex = tokens.findBracketEnd(nextToken, index + 1)
						exp = tokens.slice(index + 2, endIndex)
						accessors.push new PathAccessor(token, 'call', exp)
						setIndex(endIndex)
					else
						accessors.push new PathAccessor(token, 'prop')

			else if token.isOperator
				switch token.value
					when '['
						endIndex = tokens.findBracketEnd(token, index)
						exp = tokens.slice(index + 1, endIndex)
						accessors.push new PathAccessor(null, 'exp', exp)
						setIndex(endIndex)
					when '('
						endIndex = tokens.findBracketEnd(token, index)
						exp = tokens.slice(index + 1, endIndex)
						accessors.push new PathAccessor(null, 'call', exp)
						setIndex(endIndex)

		return accessors


	compile: (setterMode = off)->
		firstProp = @accessors[0].name.compile()
		path = "(#{VAR_LOCALS}.#{firstProp}!=null?#{VAR_LOCALS}:#{VAR_CONTEXT})"

		for accessor, index in @accessors
			if index is 0 and accessor.type isnt 'call'
				path += accessor.compile()
				continue
			if setterMode and index is @accessors.length - 1
				path = accessor.setterEscape(path)
				continue
			path = accessor.escape(path)

		return path


####################################
# PathAccessor
####################################
class PathAccessor

	constructor: (@name, @type, @exp = null)->
		return


	toString: ->
		return switch @type
			when 'prop' then ".#{@name}"
			when 'exp' then "[#{@exp}]"
			when 'call'
				if @name then ".#{@name}(#{@exp})"
				else "(#{@exp})"


	compile: ->
		return switch @type
			when 'prop' then ".#{@name.compile()}"
			when 'exp' then "[#{@exp.compile()}]"
			when 'call'
				if @name then ".#{@name.compile()}(#{@exp.compile()})"
				else "(#{@exp.compile()})"


	escape: (base)->
		ref = VAR_REF
		return switch @type
			when 'prop'
				"(#{ref}=#{base},#{ref}!=null?#{ref}.#{@name}:void 0)"
			when 'exp'
				"(#{ref}=#{base},#{ref}!=null?#{ref}[#{@exp.compile()}]:void 0)"
			when 'call'
				exp = @exp.compile()
				if @name
					"(#{ref}=#{base},#{ref}!=null&&typeof #{ref}.#{@name}==='function'?#{ref}.#{@name}(#{exp}):void 0)"
				else
					"(#{ref}=#{base},typeof #{ref}==='function'?#{ref}(#{exp}):void 0)"


	setterEscape: (base)->
		return "(#{base} || {})#{@toString()}"

