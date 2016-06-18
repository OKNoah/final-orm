'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

var _fieldType = require('./fields/field-type');

var _fieldType2 = _interopRequireDefault(_fieldType);

var _fieldTypes = require('./fields/field-types');

var _fieldTypes2 = _interopRequireDefault(_fieldTypes);

var _fieldSchemas = require('./fields/field-schemas');

var _fieldSchemas2 = _interopRequireDefault(_fieldSchemas);

var _fieldModel = require('./fields/field-model');

var _fieldModel2 = _interopRequireDefault(_fieldModel);

var _fieldModels = require('./fields/field-models');

var _fieldModels2 = _interopRequireDefault(_fieldModels);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Schema = function () {
	function Schema(userSchema) {
		var isRootSchema = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

		_classCallCheck(this, Schema);

		this.fields = this.parseUserSchema(userSchema);

		if (isRootSchema) {
			this.fields.push(new _fieldType2.default(['_id'], String, true));
			this.fields.push(new _fieldType2.default(['_key'], String, true));
			this.fields.push(new _fieldType2.default(['_rev'], String, true));
			this.fields.push(new _fieldType2.default(['_removed'], Boolean, true));
			// TODO сделать проверку что не может иметь такие то свойства
		}
	}

	_createClass(Schema, [{
		key: 'parseUserSchema',
		value: function parseUserSchema(userSchema) {
			var basePath = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

			var fields = [];

			for (var key in userSchema) {
				if (userSchema.hasOwnProperty(key)) {
					var value = userSchema[key];
					var path = basePath.concat([key]);

					if (typeof value === 'function') {
						if (value.prototype instanceof _model2.default) {
							fields.push(new _fieldModel2.default(path, value));
						} else {
							fields.push(new _fieldType2.default(path, value));
						}
					} else if (Array.isArray(value)) {
						var firstItem = value[0];

						if (typeof firstItem === 'function') {

							if (firstItem.prototype instanceof _model2.default) {
								fields.push(new _fieldModels2.default(path, firstItem));
							} else {
								fields.push(new _fieldTypes2.default(path, firstItem));
							}
						} else {
							fields.push(new _fieldSchemas2.default(path, firstItem));
						}
					} else {
						var subFields = this.parseUserSchema(value, path);
						fields.push.apply(fields, _toConsumableArray(subFields));
					}
				}
			}return fields;
		}
	}, {
		key: 'validate',
		value: function validate(data) {
			var basePath = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

			this.fields.forEach(function (field) {
				return field.validate(data, basePath);
			});
		}
	}, {
		key: 'documentToModel',
		value: function documentToModel(model, document) {
			this.fields.forEach(function (field) {
				field.documentToModel(model, document);
			});
			return model;
		}
	}, {
		key: 'modelToDocument',
		value: function modelToDocument(model, document) {
			this.fields.forEach(function (field) {
				field.modelToDocument(model, document);
			});
			return document;
		}
	}]);

	return Schema;
}();

exports.default = Schema;

//# sourceMappingURL=schema.js.map