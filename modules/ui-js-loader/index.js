'use strict';

var _sourceMap = require('source-map');

module.exports = function (source, map) {

	if (this.cacheable) {
		this.cacheable();
	}

	var exceptRegExp = /[\\/]webpack[\\/]buildin[\\/]module\.js|[\\/]ui-js-loader[\\/]/;

	if (exceptRegExp.test(this.resourcePath)) {
		return this.callback(null, source, map);
	}

	var separator = '\n\n';
	var appendText = 'if(module.hot){\n\t\trequire(' + JSON.stringify(require.resolve('./hot-loader')) + ').patch(module)\n\t};';

	if (this.sourceMap === false) {
		var _code = [source, appendText].join(separator);
		return this.callback(null, _code);
	}

	var node = new _sourceMap.SourceNode(null, null, null, [_sourceMap.SourceNode.fromStringWithSourceMap(source, new _sourceMap.SourceMapConsumer(map)), new _sourceMap.SourceNode(null, null, this.resourcePath, appendText)]).join(separator);

	var result = node.toStringWithSourceMap();
	var codeMap = result.map.toString();
	var code = result.code;

	this.callback(null, code, codeMap);
};

//# sourceMappingURL=index.js.map