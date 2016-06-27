'use strict';

require('babel-polyfill');

var _connection = require('./core/connection');

var _connection2 = _interopRequireDefault(_connection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

// import User from './models/user'

_connection2.default.addMethods({
	'ololo': function ololo(a, b) {
		var _this = this;

		return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							throw 33;

						case 2:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, _this);
		}))();
	}
});

//# sourceMappingURL=index.js.map