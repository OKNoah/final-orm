module.exports = class Directive 

	@priority = 0
	@attribute = ''
	@terminal = off


	@compileDirectives: (components)->
		return components.map (DirClass)-> Directive.create(DirClass)


	@create: (DirClass)->
		for own key, value of @ when typeof value isnt 'function'
			DirClass[key] = DirClass[key] or value
		return DirClass


