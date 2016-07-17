module.exports = class Directive 

	@priority = 0
	@attribute = ''
	@terminal = off


	@create: (Class)->
		for own key, value of @ when typeof value isnt 'function'
			Class[key] = Class[key] or value
		return Class


