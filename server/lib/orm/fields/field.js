'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _validationError = require('../errors/validation-error');

var _validationError2 = _interopRequireDefault(_validationError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** @abstract Field */

var Field = function () {
	function Field() {
		var basePath = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
		var path = arguments[1];
		var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var internal = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

		_classCallCheck(this, Field);

		this.basePath = basePath;
		this.path = path;
		this.options = options;
		this.internal = internal;
	}

	_createClass(Field, [{
		key: 'toPrettyPath',
		value: function toPrettyPath(subPaths) {
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
		key: 'typeError',
		value: function typeError(type, value) {
			var subPath = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
			var basePath = arguments.length <= 3 || arguments[3] === undefined ? this.basePath : arguments[3];

			var subPaths = [basePath, this.path, subPath];
			var pathString = this.toPrettyPath(subPaths);
			var valueText = value;

			if (Object(value) === value) {
				valueText = value.constructor.name;
			} else if (typeof value === 'string') {
				valueText = '\'' + value + '\'';
			}

			var message = 'Field \'' + pathString + '\' must be ' + type.name + ', but have ' + valueText;
			throw new _validationError2.default(message);
		}
	}, {
		key: 'throwError',
		value: function throwError(message) {
			var subPath = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

			throw new ValidationRangeError();
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
			if (this.internal) return;
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
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.path[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var prop = _step.value;

					context = context[prop];
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

			return context;
		}
	}, {
		key: 'setByPath',
		value: function setByPath(context, value) {
			var path = this.path.slice();
			var lastProp = path.pop();

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = path[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var prop = _step2.value;

					if (!context[prop]) context[prop] = {};
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

			return context[lastProp] = value;
		}
	}]);

	return Field;
}();

exports.default = Field;

//# sourceMappingURL=field.js.map