module.exports = class Cookies


	@get: (name)->
		regExp = new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
		matches = document.cookie.match(regExp)
		return if matches then decodeURIComponent(matches[1]) else undefined


	@set: (name, value, options = {})->
		expires = options.expires
		if expires and typeof expires is 'number'
			d = new Date
			d.setTime d.getTime() + expires * 1000
			expires = options.expires = d
		if expires and expires.toUTCString
			options.expires = expires.toUTCString()
		value = encodeURIComponent(value)
		updatedCookie = name + '=' + value
		for propName of options
			updatedCookie += '; ' + propName
			propValue = options[propName]
			if propValue != true
				updatedCookie += '=' + propValue
		document.cookie = updatedCookie
		return value


	@remove: (name) ->
		@set(name, '', expires: -1)
		return

