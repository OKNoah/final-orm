'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var API = function (_ref) {
	_inherits(API, _ref);

	function API() {
		_classCallCheck(this, API);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(API).apply(this, arguments));
	}

	return API;
}(null);

exports.default = API;

var ListAPI = exports.ListAPI = function (_API) {
	_inherits(ListAPI, _API);

	function ListAPI() {
		_classCallCheck(this, ListAPI);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(ListAPI).apply(this, arguments));
	}

	_createClass(ListAPI, [{
		key: 'get',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(params) {
				var filter, limit, skip;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								filter = params.get('filter', Object);
								limit = params.get('limit', Number, { min: 1, max: 100 });
								skip = params.get('skip', Number, { min: 0 });
								_context.next = 5;
								return this.constructor.model.find(filter, skip, limit);

							case 5:
								return _context.abrupt('return', _context.sent);

							case 6:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function get(_x) {
				return ref.apply(this, arguments);
			}

			return get;
		}()

		// async add(data) {
		// 	return await this.constructor.model.add(data)
		// }

	}]);

	return ListAPI;
}(API);

ListAPI.model = null;

//# sourceMappingURL=api.js.map