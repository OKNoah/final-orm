SourceNode = require('source-map').SourceNode
SourceMapConsumer = require('source-map').SourceMapConsumer 

exceptRegExp = /[\\/]webpack[\\/]buildin[\\/]module\.js|[\\/]ui-js-loader[\\/]/


module.exports = (source, map) ->
	@cacheable?()

	if exceptRegExp.test(@resourcePath)
		return @callback(null, source, map)

	separator = '\n\n'
	appendText = 'if(module.hot){
		require(' + JSON.stringify(require.resolve('./hot-loader')) + ').patch(module)
	};'


	if @sourceMap is false
		return @callback null, [
			source
			appendText
		].join(separator)


	node = new SourceNode(null, null, null, [
		SourceNode.fromStringWithSourceMap(source, new SourceMapConsumer(map))
		new SourceNode(null, null, @resourcePath, appendText)
	]).join(separator)

	result = node.toStringWithSourceMap()
	@callback null, result.code, result.map.toString()
	return

