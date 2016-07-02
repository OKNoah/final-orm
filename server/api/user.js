'use strict';

var _connection = require('../core/connection');

var _connection2 = _interopRequireDefault(_connection);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

_connection2.default.addMethods('user', {
	add: function add() {
		var _this = this;

		return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							_context.next = 2;
							return _user2.default.findOne();

						case 2:
							return _context.abrupt('return', _context.sent);

						case 3:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, _this);
		}))();
	},
	remove: function remove() {
		var _this2 = this;

		return _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
			return regeneratorRuntime.wrap(function _callee2$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							_context2.next = 2;
							return _user2.default.findOne();

						case 2:
							return _context2.abrupt('return', _context2.sent);

						case 3:
						case 'end':
							return _context2.stop();
					}
				}
			}, _callee2, _this2);
		}))();
	}
});

//# sourceMappingURL=user.js.map