WebpackDevServer = require 'webpack-dev-server'
webpackConf = require '../webpack.conf'
webpack = require 'webpack'
path = require 'path'


module.exports = (options, callback)->
	compiler = webpack(webpackConf.dev)
	devServer = new WebpackDevServer compiler,
		contentBase: path.resolve(webpackConf.BUILD)
		hot: yes

	devServer.listen webpackConf.PORT, webpackConf.HOST, (err)->
		if err then throw new @util.PluginError('webpack-dev-server', err)
		callback()
		return

	return

