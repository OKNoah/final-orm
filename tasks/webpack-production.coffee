webpackConf = require('../webpack.conf')
webpack = require 'webpack'


module.exports = (options, callback)->
			
	webpack webpackConf.production, (err, stats)=>
		if (err) then throw new @util.PluginError('webpack', err)
		@util.log('[webpack]', stats.toString({}))
		callback()

		
		
		