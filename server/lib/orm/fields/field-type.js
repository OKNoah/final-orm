'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _field = require('./field');

var _field2 = _interopRequireDefault(_field);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FieldType = function (_Field) {
	_inherits(FieldType, _Field);

	function FieldType(basePath, path, type, options) {
		var internal = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

		_classCallCheck(this, FieldType);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FieldType).call(this, basePath, path, options, internal));

		_this.type = type;
		_this.checkType(type);
		return _this;
	}

	_createClass(FieldType, [{
		key: 'checkType',
		value: function checkType(type) {
			if (type === Boolean) return;
			if (type === String) return;
			if (type === Number) return;
			if (type === Date) return;

			if (!type.prototype.toJSON) {
				throw Error('Custom Type ' + type.name + ' must have method toJSON()');
			}

			if (!type.fromJSON) {
				throw Error('Custom Type ' + type.name + ' must have static method \'fromJSON\': ' + type.name + '.fromJSON(document)');
			}
		}
	}, {
		key: 'validate',
		value: function validate(data, basePath) {
			if (this.internal) return;

			var value = this.getByPath(data);
			if (!this.validateValue(value, basePath)) {
				this.typeError(this.type, value);
			}
		}
	}, {
		key: 'validateValue',
		value: function validateValue(value, basePath) {
			var type = this.type;

			switch (type) {
				case String:
					return typeof value === 'string';
				case Number:
					return this.validateNumber(value, basePath);
				case Boolean:
					return typeof value === 'boolean';
				default:
					return value instanceof type;
			}
		}
	}, {
		key: 'validateNumber',
		value: function validateNumber(value, basePath) {
			if (typeof value !== 'number') return false;
			var options = this.options;

			if ('min' in options) if (value < options.min) {
				console.log(111111111111111111111);
				// throw new ValidationRangeError([basePath, this.path], `RANGE`)
			}
			// if ('max' in options) if (value > options.max) return false
			return true;
		}
	}, {
		key: 'convertToModelValue',
		value: function convertToModelValue(value) {
			if (value == null) return value;
			var type = this.type;

			switch (type) {
				case String:
					return String(value);
				case Number:
					return Number(value);
				case Boolean:
					return Boolean(value);
				case Date:
					return new Date(value);
			}

			return type.fromJSON(value);
		}
	}, {
		key: 'convertToDocumentValue',
		value: function convertToDocumentValue(value) {
			if (value == null) return value;

			switch (this.type) {
				case String:
					return value;
				case Number:
					return value;
				case Boolean:
					return value;
				case Date:
					return value.getTime();
			}

			return value.toJSON();
		}
	}]);

	return FieldType;
}(_field2.default);

exports.default = FieldType;

//# sourceMappingURL=field-type.js.map