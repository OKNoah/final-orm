'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _model = require('../core/model');

var _model2 = _interopRequireDefault(_model);

var _utils = require('../core/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var User = function (_Model) {
	_inherits(User, _Model);

	function User() {
		_classCallCheck(this, User);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(User).apply(this, arguments));
	}

	_createClass(User, [{
		key: 'startSession',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
				var key;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								key = _utils2.default.createRandomString(64);
								_context.next = 3;
								return Session.add({ key: key, user: this });

							case 3:
								return _context.abrupt('return', _context.sent);

							case 4:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function startSession() {
				return ref.apply(this, arguments);
			}

			return startSession;
		}()
	}], [{
		key: 'getBySessionKey',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(key) {
				var session;
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.next = 2;
								return Session.findOne({ key: key });

							case 2:
								session = _context2.sent;

								if (session) {
									_context2.next = 5;
									break;
								}

								return _context2.abrupt('return', null);

							case 5:
								_context2.next = 7;
								return session.user;

							case 7:
								return _context2.abrupt('return', _context2.sent);

							case 8:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function getBySessionKey(_x) {
				return ref.apply(this, arguments);
			}

			return getBySessionKey;
		}()
	}]);

	return User;
}(_model2.default);

User.schema = {
	name: String,
	age: Number
};
exports.default = User;

var Session = function (_Model2) {
	_inherits(Session, _Model2);

	function Session() {
		_classCallCheck(this, Session);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Session).apply(this, arguments));
	}

	return Session;
}(_model2.default);

//
// (async function () {
// 	try {
//
// 		let user = await User.add({name: 'Ашот', age: 3333})
//
// 		let users = await User.have({name: 'Ашот'})
// 		console.log(users)
//
// 	} catch (e) {
// 		console.error(e)
// 	}
// })()


Session.schema = {
	key: { $type: String, $index: true, $unique: true },
	user: User
};

//# sourceMappingURL=user.js.map