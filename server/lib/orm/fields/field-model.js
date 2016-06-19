"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _field = require("./field");

var _field2 = _interopRequireDefault(_field);

var _model = require("../model");

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FieldModel = function (_Field) {
	_inherits(FieldModel, _Field);

	function FieldModel(basePath, path, Model, options) {
		var internal = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

		_classCallCheck(this, FieldModel);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FieldModel).call(this, basePath, path, options, internal));

		_this.Model = Model;
		_this.symbol = Symbol();
		return _this;
	}

	_createClass(FieldModel, [{
		key: "validate",
		value: function validate(data, basePath) {
			if (this.internal) return;
			if (data instanceof _model2.default) return;
			var subModel = this.getByPath(data);

			if (!this.validateValue(subModel)) {
				this.typeError(this.Model, subModel, basePath);
			}
		}
	}, {
		key: "validateValue",
		value: function validateValue(value) {
			return value instanceof this.Model;
		}
	}, {
		key: "documentToModel",
		value: function documentToModel(model, document) {
			var id = this.getByPath(document);
			this.setBySymbol(model, this.symbol, id);
			this.setAccessorByPath(model);
		}
	}, {
		key: "modelToDocument",
		value: function modelToDocument(model, document) {
			if (this.internal) return;
			if (model instanceof _model2.default) {
				var id = this.getBySymbol(model, this.symbol);
				this.setByPath(document, id);
			} else {
				var subModel = this.getByPath(model);
				var _id = subModel._id;
				this.setByPath(document, _id);
			}
		}
	}, {
		key: "setAccessorByPath",
		value: function setAccessorByPath(model) {
			var _this2 = this;

			var path = this.path.slice();
			var lastProp = path.pop();
			var context = model;

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = path[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var prop = _step.value;

					if (!context[prop]) context[prop] = {};
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

			Object.defineProperty(context, lastProp, {
				// enumerable: true,
				configurable: true,
				get: function get() {
					return _this2.fieldGetter(model);
				},
				set: function set(value) {
					return _this2.fieldSetter(model, value);
				}
			});
		}
	}, {
		key: "fieldGetter",
		value: function fieldGetter(model) {
			var id = this.getBySymbol(model, this.symbol);
			return this.Model.get(id);
		}
	}, {
		key: "fieldSetter",
		value: function fieldSetter(model, value) {
			if (!this.validateValue(value)) {
				this.typeError(this.Model, value);
			}
			var id = value._id;
			this.setBySymbol(model, this.symbol, id);
		}
	}, {
		key: "getBySymbol",
		value: function getBySymbol(context, symbol) {
			var path = this.path.slice(0, -1);

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = path[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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

			return context[symbol];
		}
	}, {
		key: "setBySymbol",
		value: function setBySymbol(context, symbol, value) {
			var path = this.path.slice(0, -1);

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

			return context[symbol] = value;
		}
	}]);

	return FieldModel;
}(_field2.default);

exports.default = FieldModel;

//# sourceMappingURL=field-model.js.map