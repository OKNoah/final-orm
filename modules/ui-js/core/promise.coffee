EventEmitter = require('ui-js/core/event-emitter')
SystemPromise = window.Promise


module.exports = UiJsPromise = (caller)->
	_resolve = null
	_reject = null
	promise = new SystemPromise (resolve, reject)->
		_resolve = resolve
		_reject = reject
		return caller?(resolve, reject)

	promise.resolve = _resolve
	promise.reject = _reject
	return promise


UiJsPromise.prototype = SystemPromise.prototype
UiJsPromise.all = -> SystemPromise.all(arguments...)
UiJsPromise.race = -> SystemPromise.race(arguments...)
UiJsPromise.race = -> SystemPromise.race(arguments...)
UiJsPromise.defer = -> SystemPromise.defer(arguments...)
UiJsPromise.accept = -> SystemPromise.accept(arguments...)
UiJsPromise.reject = -> SystemPromise.reject(arguments...)
UiJsPromise.resolve = -> SystemPromise.resolve(arguments...)


