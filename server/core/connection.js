'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ss = require('socket.io-stream');
var socketIo = require('socket.io');
var cookie = require('cookie');

var Connection = function () {
	_createClass(Connection, null, [{
		key: 'addMethods',
		value: function addMethods(obj) {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					var method = obj[key];
					this.methods[key] = method;
				}
			}
		}
	}, {
		key: 'callMethod',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(name, args, context) {
				var method;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								method = this.methods[name];

								if (method) {
									_context.next = 3;
									break;
								}

								throw Error('Нет такого метода \'' + name + '\'');

							case 3:
								return _context.abrupt('return', method.call.apply(method, [context].concat(_toConsumableArray(args))));

							case 4:
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
								this.io = socketIo(_config2.default.port, {});
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
		key: 'onConnection',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(socket) {
				var user, connection;
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								socket = ss(socket);
								_context3.next = 3;
								return this.getUser(socket);

							case 3:
								user = _context3.sent;
								connection = new this(socket, user);

							case 5:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function onConnection(_x4) {
				return ref.apply(this, arguments);
			}

			return onConnection;
		}()
	}, {
		key: 'getUser',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(socket) {
				var cookiesString, cookies, sessionKey;
				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								cookiesString = socket.sio.conn.request.headers.cookie;
								cookies = cookie.parse(cookiesString);
								sessionKey = cookies['session-key'];
								_context4.next = 5;
								return _user2.default.getBySessionKey(sessionKey);

							case 5:
								return _context4.abrupt('return', _context4.sent);

							case 6:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function getUser(_x5) {
				return ref.apply(this, arguments);
			}

			return getUser;
		}()
	}]);

	function Connection(socket, user) {
		_classCallCheck(this, Connection);

		this.socket = socket;
		this.user = user;
		this.initHandlers();
	}

	_createClass(Connection, [{
		key: 'initHandlers',
		value: function initHandlers() {
			var _this2 = this;

			this.socket.on('request', function (request) {
				return _this2.onRequest(request);
			});
		}
	}, {
		key: 'onRequest',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(request) {
				var _this3 = this;

				var tasks, id, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, task, responses;

				return regeneratorRuntime.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								tasks = request.tasks;
								id = request.id;

								tasks = tasks.map(function (options) {
									return new Task(_this3, options);
								});
								_iteratorNormalCompletion = true;
								_didIteratorError = false;
								_iteratorError = undefined;
								_context5.prev = 6;
								_iterator = tasks[Symbol.iterator]();

							case 8:
								if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
									_context5.next = 15;
									break;
								}

								task = _step.value;
								_context5.next = 12;
								return task.run();

							case 12:
								_iteratorNormalCompletion = true;
								_context5.next = 8;
								break;

							case 15:
								_context5.next = 21;
								break;

							case 17:
								_context5.prev = 17;
								_context5.t0 = _context5['catch'](6);
								_didIteratorError = true;
								_iteratorError = _context5.t0;

							case 21:
								_context5.prev = 21;
								_context5.prev = 22;

								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}

							case 24:
								_context5.prev = 24;

								if (!_didIteratorError) {
									_context5.next = 27;
									break;
								}

								throw _iteratorError;

							case 27:
								return _context5.finish(24);

							case 28:
								return _context5.finish(21);

							case 29:
								responses = tasks.map(function (task) {
									return task.toJSON();
								});

								this.sendResponse(responses, id);

							case 31:
							case 'end':
								return _context5.stop();
						}
					}
				}, _callee5, this, [[6, 17, 21, 29], [22,, 24, 28]]);
			}));

			function onRequest(_x6) {
				return ref.apply(this, arguments);
			}

			return onRequest;
		}()
	}, {
		key: 'sendResponse',
		value: function sendResponse(responses, id) {
			this.socket.emit('response', {
				responses: responses,
				id: id
			});
		}
	}]);

	return Connection;
}();

Connection.io = null;
Connection.methods = {};
exports.default = Connection;

var Task = function () {
	function Task(connection, options) {
		_classCallCheck(this, Task);

		this.connection = connection;
		this.method = options.method;
		this.args = options.args;

		this.done = false;
		this.error = null;
		this.result = null;
	}

	_createClass(Task, [{
		key: 'resolve',
		value: function resolve(result) {
			if (this.done) return;
			this.result = result;
			this.done = true;
		}
	}, {
		key: 'reject',
		value: function reject(error) {
			if (this.done) return;
			this.error = error;
			this.done = true;
		}
	}, {
		key: 'run',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
				var result;
				return regeneratorRuntime.wrap(function _callee6$(_context6) {
					while (1) {
						switch (_context6.prev = _context6.next) {
							case 0:
								_context6.prev = 0;
								_context6.next = 3;
								return Connection.callMethod(this.method, this.args, this);

							case 3:
								result = _context6.sent;
								_context6.next = 9;
								break;

							case 6:
								_context6.prev = 6;
								_context6.t0 = _context6['catch'](0);

								this.reject(_context6.t0);

							case 9:
								this.resolve(result);

							case 10:
							case 'end':
								return _context6.stop();
						}
					}
				}, _callee6, this, [[0, 6]]);
			}));

			function run() {
				return ref.apply(this, arguments);
			}

			return run;
		}()
	}, {
		key: 'toJSON',
		value: function toJSON() {
			return {
				error: this.error,
				result: this.result
			};
		}
	}]);

	return Task;
}();

Connection.connect();

//# sourceMappingURL=connection.js.map