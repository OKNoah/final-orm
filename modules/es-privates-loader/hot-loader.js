'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _componentPatcher = require('./component-patcher');

var _componentPatcher2 = _interopRequireDefault(_componentPatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
	function HotLoader() {
		_classCallCheck(this, HotLoader);
	}

	_createClass(HotLoader, null, [{
		key: 'patch',
		value: function patch(module) {
			if (!module.hot) {
				return;
			}

			if (typeof module.exports === 'function') {
				module.exports = this.patchTarget(module.exports, module);
			} else {
				for (var key in module.exports) {
					var target = module.exports[key];
					module.exports[key] = this.patchTarget(target, module);
				}
			}
		}
	}, {
		key: 'patchTarget',
		value: function patchTarget(target, module) {
			if (_componentPatcher2.default.test(target)) {
				target = _componentPatcher2.default.patch(target, module);
			}
			return target;
		}
	}]);

	return HotLoader;
}();

//# sourceMappingURL=hot-loader.js.map