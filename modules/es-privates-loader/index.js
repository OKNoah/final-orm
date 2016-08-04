'use strict';

var _compiler = require('./compiler');

var _compiler2 = _interopRequireDefault(_compiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (source, map) {
	if (this.cacheable) {
		this.cacheable();
	}

	var exceptRegExp = /[\\/]webpack[\\/]buildin[\\/]module\.js|[\\/]es-privates-loader[\\/]/;

	if (exceptRegExp.test(this.resourcePath)) {
		return this.callback(null, source, map);
	}

	var compiled = (0, _compiler2.default)(source);
	this.callback(null, compiled);
};

//# sourceMappingURL=index.js.map