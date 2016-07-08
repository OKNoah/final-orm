'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Session = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _passwordHash = require('password-hash');

var _passwordHash2 = _interopRequireDefault(_passwordHash);

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


		///////////////////////////////////////
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
	}, {
		key: 'checkPass',
		value: function checkPass(pass) {
			return _passwordHash2.default.verify(this.pass, pass);
		}
	}], [{
		key: 'getBySession',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(session) {
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								if (session) {
									_context2.next = 2;
									break;
								}

								return _context2.abrupt('return', null);

							case 2:
								_context2.next = 4;
								return session.user;

							case 4:
								return _context2.abrupt('return', _context2.sent);

							case 5:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function getBySession(_x) {
				return ref.apply(this, arguments);
			}

			return getBySession;
		}()
	}, {
		key: 'add',
		value: function add(_ref) {
			var login = _ref.login;
			var pass = _ref.pass;

			pass = _passwordHash2.default.generate(pass);
			return _get(Object.getPrototypeOf(User), 'add', this).call(this, { login: login, pass: pass });
		}
	}]);

	return User;
}(_model2.default);

// class Session


User.schema = {
	login: { $type: String, $unique: true },
	pass: String
};
exports.default = User;

var Session = exports.Session = function (_Model2) {
	_inherits(Session, _Model2);

	function Session() {
		_classCallCheck(this, Session);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Session).apply(this, arguments));
	}

	_createClass(Session, [{
		key: 'close',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								_context3.next = 2;
								return this.remove();

							case 2:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function close() {
				return ref.apply(this, arguments);
			}

			return close;
		}()
	}], [{
		key: 'getByKey',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(key) {
				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								if (key) {
									_context4.next = 2;
									break;
								}

								return _context4.abrupt('return', null);

							case 2:
								_context4.next = 4;
								return this.findOne({ key: key });

							case 4:
								return _context4.abrupt('return', _context4.sent);

							case 5:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function getByKey(_x2) {
				return ref.apply(this, arguments);
			}

			return getByKey;
		}()
	}]);

	return Session;
}(_model2.default);

Session.schema = {
	key: { $type: String, $unique: true },
	user: User
};

//# sourceMappingURL=user.js.map