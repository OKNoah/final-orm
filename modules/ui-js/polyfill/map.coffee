module.exports = window['Map'] or class Map 


		constructor: ->
			@keys = []
			@values = []
			return


		get: (key)->
			index = @keys.indexOf(key)
			return @values[index]


		set: (key, value)->
			index = @keys.indexOf(key)
			if index isnt -1
				@values[index] = value
			else
				@keys.push(key)
				@values.push(value)
			return value


		has: (key)->
			index = @keys.indexOf(key)
			return index isnt -1


		delete: (key)->
			index = @keys.indexOf(key)
			if index isnt -1
				@keys.splice(index, 1)
				@values.splice(index, 1)
			return


