'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ValidationError = function (_TypeError) {
	_inherits(ValidationError, _TypeError);

	function ValidationError(subPaths, type, value) {
		_classCallCheck(this, ValidationError);

		var pathString = ValidationError.toPrettyPath(subPaths);
		var valueText = value;

		if (Object(value) === value) {
			valueText = value.constructor.name;
		} else if (typeof value === 'string') {
			valueText = '\'' + value + '\'';
		}

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ValidationError).call(this, 'Field \'' + pathString + '\' must be ' + type.name + ', but have ' + valueText));

		_this.name = 'ValidationError';
		return _this;
	}

	_createClass(ValidationError, null, [{
		key: 'toPrettyPath',
		value: function toPrettyPath(subPaths) {
			var _ref;

			var props = (_ref = []).concat.apply(_ref, _toConsumableArray(subPaths));

			var pathString = props.map(function (prop, index) {
				if (typeof prop === 'number') return '[' + prop + ']';
				if (index === 0) return prop;
				return '.' + prop;
			}).join('');

			return pathString;
		}
	}]);

	return ValidationError;
}(TypeError);

exports.default = ValidationError;

//# sourceMappingURL=validation-error.js.map