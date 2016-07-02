CleanWebpackPlugin = require 'clean-webpack-plugin'
HtmlWebpackPlugin = require 'html-webpack-plugin'
minimatch = require 'minimatch'
webpack = require 'webpack'
path = require 'path'
nib = require 'nib'


PROJECT_NAME = 'roulette'
HTML = "./src/#{PROJECT_NAME}/index.jade"
SCRIPT = "./src/#{PROJECT_NAME}/index.es6"
STYLE = "./src/#{PROJECT_NAME}/index.styl"
BUILD = "./build/#{PROJECT_NAME}/"

HOST = '0.0.0.0'
PORT = 1337


override = (target, data) ->
	wrapper = Object.create(target)
	for key of data
		if data.hasOwnProperty(key)
			wrapper[key] = data[key]
	return wrapper


loader = (pattern, loaderName) ->
	if pattern instanceof RegExp
		test = pattern
	else
		test = (filepath) ->
			filepath = path.relative(__dirname, filepath)
			minimatch filepath, pattern, matchBase: true
	return {
		test: test
		loader: loaderName
	}


productionConf =


	devtool: 'cheap-module-eval-source-map'

	module:
		loaders: [
			loader('src/**/*.jade', 'jade'),
			loader('src/**/*.coffee', 'ui-js-hot-loader!coffee'),
			loader('src/**/*.es6', 'ui-js-hot-loader!babel?{"presets":["es2015","stage-0"],"plugins":["transform-decorators-legacy"]}'),
			loader('src/**/*.css', 'css!autoprefixer?browsers=last 2 version'),
			loader('src/**/*.styl', 'css!autoprefixer?browsers=last 2 version!stylus'),
			loader('src/**/*.{jpeg,jpg,png,gif,svg}', 'url?limit=10000&name=images/[hash].[ext]!img?progressive=true'),
			loader('src/**/*.{mp3,mp4,wmv}', 'url?limit=10000&name=media/[hash].[ext]'),
			loader('src/**/*.{eot,otf,svg,ttf,woff}', 'url?limit=10000&name=fonts/[hash].[ext]'),
		]

	entry: [
		'style!' + STYLE,
		SCRIPT
	]

	output:
		path: path.resolve(BUILD)
		filename: 'scripts/[hash].js'

	resolve:
		modulesDirectories: [
			'modules'
			'node_modules'
		]
		extensions: [
			''
			'.js'
			'.es6'
			'.coffee'
		]

	resolveLoader:
		modulesDirectories: [
			'modules'
			'node_modules'
		]

	node:
		fs: 'empty'

	plugins: [
		new webpack.NoErrorsPlugin()
		new CleanWebpackPlugin([BUILD])
		new HtmlWebpackPlugin(template: path.resolve(HTML))
	]

	stylus:
		use: [nib()]
		import: ['~nib/lib/nib/index.styl']


# dev conf
devConf = override productionConf,

	entry: [
		'webpack-dev-server/client?http://' + HOST + ':' + PORT
		'webpack/hot/dev-server'
		'style!' + STYLE
		SCRIPT
	]

	plugins: [
		new (webpack.HotModuleReplacementPlugin)
		new HtmlWebpackPlugin(template: path.resolve(HTML))
	]

	devServer:
		stats: 'errors-only'


module.exports.dev = devConf
module.exports.production = productionConf
module.exports.HTML = HTML
module.exports.SCRIPT = SCRIPT
module.exports.STYLE = STYLE
module.exports.BUILD = BUILD
module.exports.HOST = HOST
module.exports.PORT = PORT

