'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _validationError = require('../errors/validation-error');

var _validationError2 = _interopRequireDefault(_validationError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @abstract class */

var Field = function () {
	function Field() {
		var basePath = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
		var path = arguments[1];
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var internal = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

		_classCallCheck(this, Field);

		if (!internal) this.checkPath(path, basePath);
		this.options = this.normalizeOptions(options);
		this.basePath = basePath;
		this.internal = internal;
		this.path = path;
	}

	_createClass(Field, [{
		key: 'isOptional',
		value: function isOptional(value) {
			return value == null && this.options.optional;
		}
	}, {
		key: 'normalizeOptions',
		value: function normalizeOptions(options) {
			var normalOptions = {};
			for (var key in options) {
				if (options.hasOwnProperty(key)) {
					var value = options[key];
					var normalKey = key.match(/^\$?(.*)/)[1];
					normalOptions[normalKey] = value;
				}
			}if (normalOptions.unique) {
				normalOptions.index = true;
			}

			return normalOptions;
		}
	}, {
		key: 'checkPath',
		value: function checkPath(path, basePath) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = path[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var prop = _step.value;

					var match = prop.match(/^([_$])/);
					if (match) {
						var stringPath = this.pathsToString([basePath, path]);
						throw Error('Field names can not begin with a \'' + match[1] + '\' symbol, but have \'' + stringPath + '\'');
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}, {
		key: 'pathsToString',
		value: function pathsToString(subPaths) {
			var _ref;

			var props = (_ref = []).concat.apply(_ref, _toConsumableArray(subPaths));

			var prettyPath = props.map(function (prop, index) {
				if (!/^[A-Za-z$_]+$/.test(prop)) return '[' + prop + ']';
				if (index === 0) return prop;
				return '.' + prop;
			}).join('');

			return prettyPath;
		}
	}, {
		key: 'valueToString',
		value: function valueToString(value) {
			if (Object(value) === value) return value.constructor.name;
			if (typeof value === 'string') return '\'' + value + '\'';
			return value;
		}
	}, {
		key: 'typeError',
		value: function typeError(type, value, basePath, subPath) {
			var valueText = this.valueToString(value);
			var message = 'must be ' + type.name + ', but have ' + valueText;
			this.throwError(message, basePath, subPath);
		}
	}, {
		key: 'throwError',
		value: function throwError(message) {
			var basePath = arguments.length <= 1 || arguments[1] === undefined ? this.basePath : arguments[1];
			var subPath = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

			var subPaths = [basePath, this.path, subPath];
			var pathString = this.pathsToString(subPaths);
			throw new _validationError2.default('Field \'' + pathString + '\' ' + message);
		}
	}, {
		key: 'documentToModel',
		value: function documentToModel(model, document) {
			var value = this.getByPath(document);
			value = this.convertToModelValue(value);
			this.setByPath(model, value);
		}
	}, {
		key: 'modelToDocument',
		value: function modelToDocument(mode, document) {
			var value = this.getByPath(mode);
			value = this.convertToDocumentValue(value);
			this.setByPath(document, value);
		}
	}, {
		key: 'validate',
		value: function validate(data) {
			throw 'validate is just virtual method';
		}
	}, {
		key: 'convertToModelValue',
		value: function convertToModelValue(value) {
			throw 'convertToModelValue is just virtual method';
		}
	}, {
		key: 'convertToDocumentValue',
		value: function convertToDocumentValue(value) {
			throw 'convertToDocumentValue is just virtual method';
		}
	}, {
		key: 'getByPath',
		value: function getByPath(context) {
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.path[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var prop = _step2.value;

					context = context[prop];
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			return context;
		}
	}, {
		key: 'setByPath',
		value: function setByPath(context, value) {
			var path = this.path.slice();
			var lastProp = path.pop();

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = path[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var prop = _step3.value;

					if (!context[prop]) context[prop] = {};
					context = context[prop];
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			return context[lastProp] = value;
		}
	}]);

	return Field;
}();

exports.default = Field;

//# sourceMappingURL=field.js.map