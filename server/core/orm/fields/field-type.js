'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

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

		_this.checkType(type);
		_this.type = type;
		return _this;
	}

	_createClass(FieldType, [{
		key: 'checkType',
		value: function checkType(type) {
			if (type === Boolean) return;
			if (type === String) return;
			if (type === Number) return;
			if (type === Date) return;
			if (type === Set) return;

			if (!type.prototype.toJSON) {
				throw Error('Custom type \'' + type.name + '\' must have method \'toJSON\'');
			}
			if (!type.fromJSON) {
				throw Error('Custom type \'' + type.name + '\' must have static method \'fromJSON\'');
			}
		}
	}, {
		key: 'validate',
		value: function validate(data, basePath) {
			if (this.internal) return;
			var value = this.getByPath(data);

			// if (this.isOptional(value)) return

			if (!this.validateValue(value, basePath)) {
				this.typeError(this.type, value, basePath);
			}
		}
	}, {
		key: 'validateValue',
		value: function validateValue(value, basePath) {
			var type = this.type;
			var options = this.options;

			if ('enum' in options) {
				this.validateEnum(value, options, basePath);
			}

			switch (type) {
				case String:
					return this.validateString(value, options, basePath);
				case Number:
					return this.validateNumber(value, options, basePath);
				case Boolean:
					return typeof value === 'boolean';
				case Set:
					return this.validateSet(value, options, basePath);
				default:
					return value instanceof type;
			}
		}
	}, {
		key: 'validateNumber',
		value: function validateNumber(value, options, basePath) {
			if (typeof value !== 'number') return false;

			if (!Number.isFinite(value)) {
				this.throwError('must be finite number, but have ' + value, basePath);
			}
			if ('min' in options) if (value < options.min) {
				this.throwError('must be more or equal ' + options.min + ', but have ' + value, basePath);
			}
			if ('max' in options) if (value > options.max) {
				this.throwError('must be less or equal ' + options.max + ', but have ' + value, basePath);
			}
			return true;
		}
	}, {
		key: 'validateString',
		value: function validateString(value, options, basePath) {
			if (typeof value !== 'string') return false;

			if ('regExp' in options) if (!options.regExp.test(value)) {
				this.throwError('must be match regExp ' + options.regExp + ', but have \'' + value + '\'', basePath);
			}
			if ('min' in options) if (value.length < options.min) {
				this.throwError('length must be more or equal ' + options.min + ' symbols, but have \'' + value + '\'', basePath);
			}
			if ('max' in options) if (value.length > options.max) {
				this.throwError('length must be less or equal ' + options.max + ' symbols, but have \'' + value + '\'', basePath);
			}
			return true;
		}
	}, {
		key: 'validateEnum',
		value: function validateEnum(value, options, basePath) {
			var enums = options.enum;
			if (enums.indexOf(value) === -1) {
				var enumText = JSON.stringify(enums);
				var valueText = this.valueToString(value);
				var message = 'must be one of enum ' + enumText + ', but have ' + valueText;
				this.throwError(message, basePath);
			}
		}
	}, {
		key: 'validateSet',
		value: function validateSet(value, options, basePath) {
			var _this2 = this;

			if (!(value instanceof Set)) return false;
			if ('set' in options) {
				(function () {
					var sets = options.set;
					value.forEach(function (item) {
						if (sets.indexOf(item) === -1) {
							var setText = JSON.stringify(sets);
							var itemValue = _this2.valueToString(item);
							var message = 'must contain item only from ' + setText + ', but have ' + itemValue;
							_this2.throwError(message, basePath);
						}
					});
				})();
			}
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
				case Set:
					return new Set(value);
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
				case Set:
					return Array.from(value);
			}

			// for custom types
			return value.toJSON();
		}
	}]);

	return FieldType;
}(_field2.default);

exports.default = FieldType;

//# sourceMappingURL=field-type.js.map