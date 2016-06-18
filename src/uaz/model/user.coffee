Model = require('../core/model')
cookies = require('../core/cookies')
server = require('../core/server')


module.exports = Model.create class User extends Model

	@current = null

	
	@setUser: (@current)->
		return


	@init: ->
		super
		@updateCurrent()
		return


	@updateCurrent: ->
		@call('current').then (user)=> @setUser(user)


	@logIn: ->
		@call('logIn', @loginForm).then (res)=>
			cookies.set('key', res.key)
			@setUser(res.user)


	@logOut: ->
		cookies.remove('key')
		@call('logOut').then => @setUser(null)


	@add: (data)->
		super(data).then (model)=>
			console.log 'added'
			return model



