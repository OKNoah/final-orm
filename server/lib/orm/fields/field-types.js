'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _fieldType = require('./field-type');

var _fieldType2 = _interopRequireDefault(_fieldType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FieldTypes = function (_FieldType) {
	_inherits(FieldTypes, _FieldType);

	function FieldTypes(basePath, path, type, options, internal) {
		_classCallCheck(this, FieldTypes);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(FieldTypes).call(this, basePath, path, type, options, internal));
	}

	_createClass(FieldTypes, [{
		key: 'validate',
		value: function validate(data, basePath) {
			var _this2 = this;

			if (this.internal) return;
			var array = this.getByPath(data);

			if (!Array.isArray(array)) {
				this.typeError(Array, array);
			}

			array.forEach(function (value, index) {
				if (!_this2.validateValue(value)) {
					_this2.typeError(_this2.type, value, [index]);
				}
			});
		}
	}, {
		key: 'convertToModelValue',
		value: function convertToModelValue(array) {
			var _this3 = this;

			return array.map(function (value) {
				return _get(Object.getPrototypeOf(FieldTypes.prototype), 'convertToModelValue', _this3).call(_this3, value);
			});
		}
	}, {
		key: 'convertToDocumentValue',
		value: function convertToDocumentValue(array) {
			var _this4 = this;

			return array.map(function (value) {
				return _get(Object.getPrototypeOf(FieldTypes.prototype), 'convertToDocumentValue', _this4).call(_this4, value);
			});
		}
	}]);

	return FieldTypes;
}(_fieldType2.default);

exports.default = FieldTypes;

//# sourceMappingURL=field-types.js.map