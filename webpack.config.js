var CleanWebpackPlugin = require('clean-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var minimatch = require('minimatch')
var webpack = require('webpack')
var path = require('path')
var nib = require('nib')


HTML = './src/index.jade'
SCRIPT = './src/index.es6'
STYLE = './src/index.styl'
BUILD = './build/'
HOST = '0.0.0.0'
PORT = 1337


module.exports = {

	devtool: 'source-map',

	module: {
		loaders: [
			loader('src/**/*.html', 'html'),
			loader('src/**/*.jade', 'jade'),
			loader('src/**/*.coffee', 'coffee'),
			loader('src/**/*.es6', 'ui-js!babel?{"presets":["es2015","stage-0"],"plugins":["transform-decorators-legacy"]}'),
			loader('src/**/*.css', 'css!autoprefixer?browsers=last 2 version'),
			loader('src/**/*.styl', 'css!autoprefixer?browsers=last 2 version!stylus'),
			loader('src/**/*.{jpeg,jpg,png,gif,svg}', 'url?limit=10000&name=images/[hash].[ext]!img?progressive=true'),
			loader('src/**/*.{eot,otf,svg,ttf,woff}', 'url?limit=10000&name=fonts/[hash].[ext]'),
			loader('src/**/*.{mp3,mp4,wmv}', 'url?limit=10000&name=media/[hash].[ext]'),
		]
	},

	entry: ['style!' + STYLE, SCRIPT],

	output: {
		path: path.resolve(BUILD),
		filename: 'scripts/[hash].js'
	},

	resolve: {
		modulesDirectories: ['modules', 'node_modules'],
		extensions: ['', '.js', '.es6', '.coffee']
	},

	resolveLoader: {
		modulesDirectories: ['modules', 'node_modules']
	},

	node: {
		fs: 'empty'
	},

	plugins: [
		new webpack.NoErrorsPlugin(),
		new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
		new CleanWebpackPlugin([BUILD]),
		new HtmlWebpackPlugin({template: path.resolve(HTML)}),
	],

	stylus: {
		use: [nib()],
		"import": ['~nib/lib/nib/index.styl']
	}

}


/**************** DEV SERVER ****************/
// webpack-dev-server --progress --colors

module.exports = override(module.exports, {

	devtool: 'cheap-module-eval-source-map',

	entry: ['webpack-dev-server/client?http://' + HOST + ':' + PORT, 'webpack/hot/dev-server', 'style!' + STYLE, SCRIPT],
	plugins: [
		new HtmlWebpackPlugin({template: path.resolve(HTML)}),
	],
	devServer: {
		stats: 'errors-only',
		host: '0.0.0.0',
		port: 1337,
	},


})


function override(target, data) {
	var key, wrapper
	wrapper = Object.create(target)
	for (key in data) {
		if (data.hasOwnProperty(key)) {
			wrapper[key] = data[key]
		}
	}
	return wrapper
}


function loader(pattern, loaderName) {
	var test
	if (pattern instanceof RegExp) {
		test = pattern
	} else {
		test = function (filepath) {
			filepath = path.relative(__dirname, filepath)
			return minimatch(filepath, pattern, {
				matchBase: true
			})
		}
	}
	return {
		test: test,
		loader: loaderName
	}
}



