module.exports = class Platform 

	constructor: ->
		userAgent = navigator.userAgent
		@edge = /Edge/.test(userAgent)
		@chrome = /Chrome/.test(userAgent) and not @edge
		@firefox = /Firefox/.test(userAgent)
		@ie = /Trident/.test(userAgent)
		@ms = @ie or @edge
		return
    
    