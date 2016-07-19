import {SourceMapConsumer, SourceNode} from 'source-map'


module.exports = function (source, map) {

	if (this.cacheable) {
		this.cacheable()
	}

	let exceptRegExp = /[\\/]webpack[\\/]buildin[\\/]module\.js|[\\/]ui-js-loader[\\/]/

	if (exceptRegExp.test(this.resourcePath)) {
		return this.callback(null, source, map)
	}

	let separator = '\n\n'
	let appendText = `if(module.hot){
		require(${JSON.stringify(require.resolve('./hot-loader')) }).patch(module)
	};`


	if (this.sourceMap === false) {
		let code = [source, appendText].join(separator)
		return this.callback(null, code)
	}


	let node = new SourceNode(null, null, null, [
		SourceNode.fromStringWithSourceMap(source, new SourceMapConsumer(map)),
		new SourceNode(null, null, this.resourcePath, appendText)
	]).join(separator)


	let result = node.toStringWithSourceMap()
	let codeMap = result.map.toString()
	let code = result.code

	this.callback(null, code, codeMap)
}

