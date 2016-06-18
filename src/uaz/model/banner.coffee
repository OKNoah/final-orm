Model = require('../core/model')
Promise = require('ui-js/core/promise')


module.exports = Model.create class Banner extends Model


	addApplication: (data)->
		params = {_id: @_id, image: data.image}
		return @constructor.call('addApplication', params)


	removeApplication: (application, needsConfirm = on)->
		if needsConfirm then promise = Notify.confirm('Вы уверены?')
		else promise = Promise.resolve()

		return promise.then =>
			index = @applications.indexOf(application)
			if index isnt -1 then @applications.splice(index, 1)
			return @save()

