'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _component = require('ui-js/core/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ComponentPatcher = function () {
	function ComponentPatcher() {
		_classCallCheck(this, ComponentPatcher);
	}

	_createClass(ComponentPatcher, null, [{
		key: 'test',
		value: function test(target) {
			if (!target) return false;
			return 'selector' in target || 'template' in target;
		}
	}, {
		key: 'patch',
		value: function patch(Class, module) {
			try {

				if (module.hot.data) {
					var Wrapper = module.hot.data.wrapper;
				} else {
					var Wrapper = this.createWrapper();
				}

				module.hot.dispose(function (data) {
					return data.wrapper = Wrapper;
				});
				module.hot.accept();

				Wrapper.__setClass(Class);
			} catch (e) {
				console.error(e);
			}

			return Wrapper;
		}
	}, {
		key: 'createWrapper',
		value: function createWrapper() {
			var Wrapper = this.createWrapperClass();
			this.allWrappers.push(Wrapper);
			return Wrapper;
		}
	}, {
		key: 'createWrapperClass',
		value: function createWrapperClass() {
			var _class, _temp;

			return _temp = _class = function () {
				function Wrapper() {
					_classCallCheck(this, Wrapper);

					return Wrapper.__activeClass.apply(this, arguments);
				}

				_createClass(Wrapper, null, [{
					key: '__setClass',
					value: function __setClass(Class) {
						this.__activeClass = Class;

						var templateHasDiff = this.__checkTemplate(Class);
						var stylesHasDiff = this.__checkStyles(Class);
						var logicHasDiff = this.__checkLogic(Class);

						var inherits = this.__getInherits();
						this.__copyPropsFrom(Class, inherits);

						if (this.__inited) {
							if (logicHasDiff) {
								this.__reload(inherits);
							} else {
								if (stylesHasDiff) this.__reloadStyles(inherits);
								if (templateHasDiff) this.__reloadTemplate(inherits);
							}
						}

						this.__inited = true;
					}
				}, {
					key: '__reload',
					value: function __reload(inherits) {
						this.reload();
						// console.log('reload logic inherits', inherits)
						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;

						try {
							for (var _iterator = inherits[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								var inherit = _step.value;
								inherit.reload();
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
					key: '__reloadTemplate',
					value: function __reloadTemplate(inherits) {
						this.reloadTemplate();
						// console.log('reload template inherits', inherits)
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = inherits[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var inherit = _step2.value;
								inherit.reloadTemplate();
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
					}
				}, {
					key: '__reloadStyles',
					value: function __reloadStyles(inherits) {
						this.reloadStyles();
						// console.log('reload styles inherits', inherits)
						var _iteratorNormalCompletion3 = true;
						var _didIteratorError3 = false;
						var _iteratorError3 = undefined;

						try {
							for (var _iterator3 = inherits[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
								var inherit = _step3.value;
								inherit.reloadStyles();
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
					}
				}, {
					key: '__getInherits',
					value: function __getInherits() {
						var SuperWrapper = arguments.length <= 0 || arguments[0] === undefined ? this : arguments[0];
						var inherits = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
						var _iteratorNormalCompletion4 = true;
						var _didIteratorError4 = false;
						var _iteratorError4 = undefined;

						try {
							for (var _iterator4 = ComponentPatcher.allWrappers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
								var _Wrapper = _step4.value;

								if (this.__isInherit(_Wrapper, SuperWrapper)) {
									if (inherits.indexOf(_Wrapper) === -1) {
										inherits.push(_Wrapper);
									}
									this.__getInherits(_Wrapper, inherits);
								}
							}
						} catch (err) {
							_didIteratorError4 = true;
							_iteratorError4 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion4 && _iterator4.return) {
									_iterator4.return();
								}
							} finally {
								if (_didIteratorError4) {
									throw _iteratorError4;
								}
							}
						}

						return inherits;
					}
				}, {
					key: '__isInherit',
					value: function __isInherit(Wrapper, SuperWrapper) {
						var prototype = Object.getPrototypeOf(Wrapper.prototype);
						while (prototype) {
							if (prototype.constructor === SuperWrapper) {
								return true;
							}
							prototype = Object.getPrototypeOf(prototype);
						}
						return false;
					}
				}, {
					key: '__copyPropsFrom',
					value: function __copyPropsFrom(Class, inherits) {
						var oldTemplate = this.template;
						var oldPrototype = this.prototype;

						var prototype = Object.getPrototypeOf(Class);
						if (Object.setPrototypeOf) Object.setPrototypeOf(this, prototype);else this.__proto__ = prototype;

						// TODO remove deleted props
						var _iteratorNormalCompletion5 = true;
						var _didIteratorError5 = false;
						var _iteratorError5 = undefined;

						try {
							for (var _iterator5 = Object.getOwnPropertyNames(Class)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
								var prop = _step5.value;

								var descriptor = Object.getOwnPropertyDescriptor(Class, prop);
								Object.defineProperty(this, prop, descriptor);
							}
						} catch (err) {
							_didIteratorError5 = true;
							_iteratorError5 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion5 && _iterator5.return) {
									_iterator5.return();
								}
							} finally {
								if (_didIteratorError5) {
									throw _iteratorError5;
								}
							}
						}

						this.prototype.constructor = this;

						_component2.default.extend(this);

						if (this.__inited) {
							this.__copyPropsToInherits(inherits, oldTemplate, oldPrototype);
						}
					}
				}, {
					key: '__copyPropsToInherits',
					value: function __copyPropsToInherits(inherits, oldTemplate, oldPrototype) {
						var _iteratorNormalCompletion6 = true;
						var _didIteratorError6 = false;
						var _iteratorError6 = undefined;

						try {
							for (var _iterator6 = inherits[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
								var inherit = _step6.value;

								// template
								if (inherit.template === oldTemplate) {
									inherit.template = this.template;
								}

								// logic
								var context = inherit.prototype;
								while (context) {
									var chainPrototype = Object.getPrototypeOf(context);
									if (chainPrototype === oldPrototype) {
										if (Object.setPrototypeOf) {
											Object.setPrototypeOf(context, this.prototype);
										} else {
											context.__proto__ = this.prototype;
										}
										break;
									}
									context = chainPrototype;
								}
							}
						} catch (err) {
							_didIteratorError6 = true;
							_iteratorError6 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion6 && _iterator6.return) {
									_iterator6.return();
								}
							} finally {
								if (_didIteratorError6) {
									throw _iteratorError6;
								}
							}
						}
					}
				}, {
					key: '__checkTemplate',
					value: function __checkTemplate(Class) {
						var template = Class.template + '';
						var hasDiff = this.__oldTemplate !== template;
						this.__oldTemplate = template;
						return hasDiff;
					}
				}, {
					key: '__checkStyles',
					value: function __checkStyles(Class) {
						var styles = Class.styles + '';
						var hasDiff = this.__oldStyles !== styles;
						this.__oldStyles = styles;
						return hasDiff;
					}
				}, {
					key: '__checkLogic',
					value: function __checkLogic(Class) {
						var logic = this.__getLogic(Class);
						var hasDiff = this.__oldLogic !== logic;
						this.__oldLogic = logic;
						return hasDiff;
					}
				}, {
					key: '__getLogic',
					value: function __getLogic(Class) {
						var code = '';

						var _iteratorNormalCompletion7 = true;
						var _didIteratorError7 = false;
						var _iteratorError7 = undefined;

						try {
							for (var _iterator7 = Object.getOwnPropertyNames(Class)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
								var prop = _step7.value;

								if (prop === 'template' || prop === 'styles') continue;
								var descriptor = Object.getOwnPropertyDescriptor(Class, prop);
								code += this.__getDescriptorCode(descriptor);
							}
						} catch (err) {
							_didIteratorError7 = true;
							_iteratorError7 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion7 && _iterator7.return) {
									_iterator7.return();
								}
							} finally {
								if (_didIteratorError7) {
									throw _iteratorError7;
								}
							}
						}

						var _iteratorNormalCompletion8 = true;
						var _didIteratorError8 = false;
						var _iteratorError8 = undefined;

						try {
							for (var _iterator8 = Object.getOwnPropertyNames(Class.prototype)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
								var _prop = _step8.value;

								var _descriptor = Object.getOwnPropertyDescriptor(Class.prototype, _prop);
								code += this.__getDescriptorCode(_descriptor);
							}
						} catch (err) {
							_didIteratorError8 = true;
							_iteratorError8 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion8 && _iterator8.return) {
									_iterator8.return();
								}
							} finally {
								if (_didIteratorError8) {
									throw _iteratorError8;
								}
							}
						}

						return code;
					}
				}, {
					key: '__getDescriptorCode',
					value: function __getDescriptorCode(descriptor) {
						if (descriptor.hasOwnProperty('value')) {
							var value = descriptor.value;

							if (typeof value === 'function') {
								return '' + descriptor.value;
							} else {
								return JSON.stringify(value);
							}
						}

						return '' + descriptor.get + descriptor.set;
					}
				}]);

				return Wrapper;
			}(), _class.__inited = false, _class.__oldStyles = null, _class.__oldTemplate = null, _class.__oldLogic = null, _class.__activeClass = null, _temp;
		}
	}]);

	return ComponentPatcher;
}();

ComponentPatcher.allWrappers = [];
exports.default = ComponentPatcher;

//# sourceMappingURL=component-patcher.js.map