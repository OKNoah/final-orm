import compiler from './compiler'


module.exports = function (source, map) {
	if (this.cacheable) {
		this.cacheable()
	}

	let exceptRegExp = /[\\/]webpack[\\/]buildin[\\/]module\.js|[\\/]es-privates-loader[\\/]/

	if (exceptRegExp.test(this.resourcePath)) {
		return this.callback(null, source, map)
	}

	let compiled = compiler(source)
	this.callback(null, compiled)
}

