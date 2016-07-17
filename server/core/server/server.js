'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _user = require('../../models/user');

var _user2 = _interopRequireDefault(_user);

var _params = require('./params');

var _params2 = _interopRequireDefault(_params);

var _apiError = require('./errors/api-error');

var _apiError2 = _interopRequireDefault(_apiError);

var _connection = require('./connection');

var _connection2 = _interopRequireDefault(_connection);

var _socket = require('socket.io-stream');

var _socket2 = _interopRequireDefault(_socket);

var _socket3 = require('socket.io');

var _socket4 = _interopRequireDefault(_socket3);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _cookie = require('cookie');

var _cookie2 = _interopRequireDefault(_cookie);

var _api = require('../api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = function () {
	function Server() {
		_classCallCheck(this, Server);
	}

	_createClass(Server, null, [{
		key: 'api',
		value: function api(apiName, ApiClass) {
			if (!(ApiClass.prototype instanceof _api2.default)) {
				throw new Error('ApiClass must instanceof API');
			}

			var api = new ApiClass();

			var methodNames = this.getApiMethodNames(api);
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = methodNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var key = _step.value;

					var name = (apiName + '.' + key).toLowerCase();
					var method = api[key].bind(api);
					this.methods[name] = method;
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
		key: 'getApiMethodNames',
		value: function getApiMethodNames(context) {
			var methodNames = [];

			while (context) {
				var keys = Object.getOwnPropertyNames(context);
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var key = _step2.value;
						if (key !== 'constructor') {
							if (methodNames.indexOf(key) !== -1) continue;
							methodNames.push(key);
						}
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

				context = Object.getPrototypeOf(context);
			}

			return methodNames;
		}
	}, {
		key: 'callMethod',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(name, params, connection) {
				var method, paramsStorage;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								method = this.methods[name.toLowerCase()];

								if (method) {
									_context.next = 3;
									break;
								}

								throw new _apiError2.default(1, name);

							case 3:
								paramsStorage = new _params2.default(params, connection);
								return _context.abrupt('return', method(paramsStorage, connection));

							case 5:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function callMethod(_x, _x2, _x3) {
				return ref.apply(this, arguments);
			}

			return callMethod;
		}()
	}, {
		key: 'connect',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
				var _this = this;

				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								this.io = (0, _socket4.default)(_config2.default.port, {});
								this.io.on('connection', function (socket) {
									return _this.onConnection(socket);
								});

							case 2:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function connect() {
				return ref.apply(this, arguments);
			}

			return connect;
		}()
	}, {
		key: 'getSession',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(cookies) {
				var sessionKey;
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								sessionKey = cookies['session-key'];
								_context3.next = 3;
								return _user.Session.getByKey(sessionKey);

							case 3:
								return _context3.abrupt('return', _context3.sent);

							case 4:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function getSession(_x4) {
				return ref.apply(this, arguments);
			}

			return getSession;
		}()
	}, {
		key: 'getCookies',
		value: function getCookies(socket) {
			var cookiesString = socket.sio.conn.request.headers.cookie;
			var cookies = _cookie2.default.parse(cookiesString);
			return cookies;
		}
	}, {
		key: 'getHeaders',
		value: function getHeaders(socket) {
			var headers = socket.sio.conn.request.headers;
			return headers;
		}
	}, {
		key: 'onConnection',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(socket) {
				var cookies, session, user, headers, connection;
				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								socket = (0, _socket2.default)(socket);
								cookies = this.getCookies(socket);
								_context4.next = 4;
								return this.getSession(cookies);

							case 4:
								session = _context4.sent;
								_context4.next = 7;
								return _user2.default.getBySession(session);

							case 7:
								user = _context4.sent;
								headers = this.getHeaders(socket);
								connection = new _connection2.default(this, socket, user, session, headers, cookies);

							case 10:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function onConnection(_x5) {
				return ref.apply(this, arguments);
			}

			return onConnection;
		}()
	}]);

	return Server;
}();

Server.io = null;
Server.methods = {};
exports.default = Server;

//# sourceMappingURL=server.js.map