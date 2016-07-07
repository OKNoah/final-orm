'use strict';

var _server = require('../core/server');

var _server2 = _interopRequireDefault(_server);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

_server2.default.addMethods('user', {
	register: function register(form) {
		var _this = this;

		return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
			var login, pass, user, session;
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							login = form.login;
							pass = form.pass;
							_context.next = 4;
							return _user2.default.have({ login: login });

						case 4:
							if (!_context.sent) {
								_context.next = 6;
								break;
							}

							_this.error(4, 'Пользователь с таким логином уже существует');

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
							return _this.setUser(user, session);

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
			}, _callee, _this);
		}))();
	},
	login: function login(form) {
		var _this2 = this;

		return _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
			var login, pass, user, session;
			return regeneratorRuntime.wrap(function _callee2$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							login = form.login;
							pass = form.pass;
							_context2.next = 4;
							return _user2.default.findOne({ login: login });

						case 4:
							user = _context2.sent;


							if (!user) {
								_this2.error(2, 'Не верный логин');
							}

							if (user.checkPass(pass)) {
								_this2.error(2, 'Не верный пароль');
							}

							_context2.next = 9;
							return user.startSession();

						case 9:
							session = _context2.sent;
							_context2.next = 12;
							return _this2.setUser(user, session);

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
			}, _callee2, _this2);
		}))();
	},
	logout: function logout() {
		var _this3 = this;

		return _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
			return regeneratorRuntime.wrap(function _callee3$(_context3) {
				while (1) {
					switch (_context3.prev = _context3.next) {
						case 0:
							_context3.next = 2;
							return _this3.logoutUser();

						case 2:
						case 'end':
							return _context3.stop();
					}
				}
			}, _callee3, _this3);
		}))();
	},
	current: function current() {
		var _this4 = this;

		return _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
			return regeneratorRuntime.wrap(function _callee4$(_context4) {
				while (1) {
					switch (_context4.prev = _context4.next) {
						case 0:
							if (_this4.user) {
								_context4.next = 2;
								break;
							}

							return _context4.abrupt('return', null);

						case 2:
							return _context4.abrupt('return', _this4.user.fields('login'));

						case 3:
						case 'end':
							return _context4.stop();
					}
				}
			}, _callee4, _this4);
		}))();
	}
});

//# sourceMappingURL=user.js.map