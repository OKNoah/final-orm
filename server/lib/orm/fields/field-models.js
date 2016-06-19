"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _fieldModel = require("./field-model");

var _fieldModel2 = _interopRequireDefault(_fieldModel);

var _model = require("../model");

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FieldModels = function (_FieldModel) {
	_inherits(FieldModels, _FieldModel);

	function FieldModels(basePath, path, Model, options) {
		var internal = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

		_classCallCheck(this, FieldModels);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FieldModels).call(this, basePath, path, Model, options, internal));

		_this.arraySymbol = Symbol();
		return _this;
	}

	_createClass(FieldModels, [{
		key: "validate",
		value: function validate(data, basePath) {
			if (this.internal) return;

			if (data instanceof _model2.default) {
				var array = this.getBySymbol(data, this.arraySymbol);
				if (!array) return;
			} else {
				array = this.getByPath(data);
			}

			this.validateRealArray(array, basePath);
		}
	}, {
		key: "validateRealArray",
		value: function validateRealArray(array, basePath) {
			var _this2 = this;

			if (!Array.isArray(array)) {
				this.typeError(Array, array, [], basePath);
			}

			array.forEach(function (value, index) {
				if (!_this2.validateValue(value)) {
					_this2.typeError(_this2.Model, value, [index], basePath);
				}
			});
		}
	}, {
		key: "documentToModel",
		value: function documentToModel(model, document) {
			var arrayIds = this.getByPath(document);
			this.setBySymbol(model, this.symbol, arrayIds);
			this.setAccessorByPath(model);
		}
	}, {
		key: "modelToDocument",
		value: function modelToDocument(model, document) {
			if (this.internal) return;

			if (model instanceof _model2.default) {
				var arrayIds = this.getActualIds(model);
				this.setByPath(document, arrayIds);
			} else {
				var array = this.getByPath(model);
				var _arrayIds = array.map(function (subModel) {
					return subModel._id;
				});
				this.setByPath(document, _arrayIds);
			}
		}
	}, {
		key: "getActualIds",
		value: function getActualIds(model) {
			var realArray = this.getBySymbol(model, this.arraySymbol);
			if (realArray) {
				return realArray.map(function (subModel) {
					return subModel._id;
				});
			} else {
				return this.getBySymbol(model, this.symbol);
			}
		}
	}, {
		key: "setAccessorByPath",
		value: function setAccessorByPath(model) {
			this.setBySymbol(model, this.arraySymbol, null);
			_get(Object.getPrototypeOf(FieldModels.prototype), "setAccessorByPath", this).call(this, model);
		}
	}, {
		key: "fieldGetter",
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(model) {
				var realArray, arrayIds;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								realArray = this.getBySymbol(model, this.arraySymbol);

								if (!realArray) {
									_context.next = 3;
									break;
								}

								return _context.abrupt("return", realArray);

							case 3:
								arrayIds = this.getBySymbol(model, this.symbol);

								realArray = this.getRealModels(arrayIds);
								this.setBySymbol(model, this.arraySymbol, realArray);
								return _context.abrupt("return", realArray);

							case 7:
							case "end":
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function fieldGetter(_x2) {
				return ref.apply(this, arguments);
			}

			return fieldGetter;
		}()
	}, {
		key: "getRealModels",
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(arrayIds) {
				var resultModels, subModels;
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.next = 2;
								return this.Model.getArr(arrayIds);

							case 2:
								resultModels = _context2.sent;
								subModels = {};

								resultModels.forEach(function (subModel) {
									subModels[subModel._id] = subModel;
								});
								return _context2.abrupt("return", arrayIds.map(function (id) {
									return subModels[id];
								}));

							case 6:
							case "end":
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function getRealModels(_x3) {
				return ref.apply(this, arguments);
			}

			return getRealModels;
		}()
	}, {
		key: "fieldSetter",
		value: function fieldSetter(model, realArray) {
			this.validateRealArray(realArray);
			this.setBySymbol(model, this.arraySymbol, realArray);
		}
	}]);

	return FieldModels;
}(_fieldModel2.default);

exports.default = FieldModels;

//# sourceMappingURL=field-models.js.map