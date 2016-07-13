'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _server = require('../core/server');

var _server2 = _interopRequireDefault(_server);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _api = require('../core/api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_server2.default.api('User', function (_API) {
	_inherits(_class, _API);

	function _class() {
		_classCallCheck(this, _class);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
	}

	_createClass(_class, [{
		key: 'register',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(params, connection) {
				var login, pass, user, session;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								login = params.get('login', String, { min: 3, max: 20, test: /^\S+$/ });
								pass = params.get('pass', String, { min: 3, max: 50, test: /^\S+$/ });
								_context.next = 4;
								return _user2.default.have({ login: login });

							case 4:
								if (!_context.sent) {
									_context.next = 6;
									break;
								}

								connection.error(4, 'Пользователь с таким логином уже существует');

							case 6:
								_context.next = 8;
								return _user2.default.add({ login: login, pass: pass });

							case 8:
								user = _context.sent;
								_context.next = 11;
								return user.startSession();

							case 11:
								session = _context.sent;
								_context.next = 14;
								return connection.setUser(user, session);

							case 14:
								return _context.abrupt('return', {
									session: session.fields('key'),
									user: user.fields('login')
								});

							case 15:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function register(_x, _x2) {
				return ref.apply(this, arguments);
			}

			return register;
		}()
	}, {
		key: 'login',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(params, connection) {
				var login, pass, user, session;
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								login = params.get('login', String, { max: 20 });
								pass = params.get('pass', String, { max: 50 });
								_context2.next = 4;
								return _user2.default.findOne({ login: login });

							case 4:
								user = _context2.sent;


								if (!user) {
									connection.error(3, 'Не верный логин');
								}

								if (!user.checkPass(pass)) {
									connection.error(3, 'Не верный пароль');
								}

								_context2.next = 9;
								return user.startSession();

							case 9:
								session = _context2.sent;
								_context2.next = 12;
								return connection.setUser(user, session);

							case 12:
								return _context2.abrupt('return', {
									session: session.fields('key'),
									user: user.fields('login')
								});

							case 13:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function login(_x3, _x4) {
				return ref.apply(this, arguments);
			}

			return login;
		}()
	}, {
		key: 'logout',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(params, connection) {
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								_context3.next = 2;
								return connection.logoutUser();

							case 2:
								return _context3.abrupt('return', true);

							case 3:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function logout(_x5, _x6) {
				return ref.apply(this, arguments);
			}

			return logout;
		}()
	}, {
		key: 'current',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(params, connection) {
				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								if (connection.user) {
									_context4.next = 2;
									break;
								}

								return _context4.abrupt('return', null);

							case 2:
								return _context4.abrupt('return', connection.user.fields('login'));

							case 3:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function current(_x7, _x8) {
				return ref.apply(this, arguments);
			}

			return current;
		}()
	}]);

	return _class;
}(_api2.default));

//# sourceMappingURL=user.js.map