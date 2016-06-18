function requireModules(gulp) {

	if (requireModules.cache) {
		return requireModules.cache
	}

	var path = require('path')
	var plumber = require('gulp-plumber')
	var plugins = require('gulp-load-plugins')({
		config: path.resolve(path.dirname(module.parent.filename), 'package.json')
	})

	var gulpSrc = gulp.src
	gulp.src = function () {
	  var stream = gulpSrc.apply(gulp, arguments)
		return stream.pipe(plumber())
		//TODO {errorHandler: function(){ Notify }}
	}

	plugins.gulp = gulp

	return requireModules.cache = {
		plugins: plugins,
		path: path,
	}

}


module.exports = function (tasksDir) {

	return function lazyTask(name, options) {
		var gulp = require('gulp')

		if (options == null) {
			options = {}
		}

		if (name === 'default') {
			return gulp.task(name, options)
		}

		return gulp.task(name, function (callback) {
			var modules = requireModules(gulp)
			var path = modules.path
			var plugins = modules.plugins

			var taskPath = path.resolve(tasksDir, name)
			var task = require(taskPath)
			return task.call(plugins, options, callback)
		})
	}

}

