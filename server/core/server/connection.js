'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _apiError = require('./errors/api-error');

var _apiError2 = _interopRequireDefault(_apiError);

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Connection = function () {
	function Connection(server, socket, user, session, headers, cookies) {
		_classCallCheck(this, Connection);

		this.session = session;
		this.cookies = cookies;
		this.headers = headers;
		this.server = server;
		this.socket = socket;
		this.user = user;
		this.initHandlers();
	}

	_createClass(Connection, [{
		key: 'initHandlers',
		value: function initHandlers() {
			var _this = this;

			this.socket.on('request', function (request) {
				return _this.onRequest(request);
			});
		}
	}, {
		key: 'setUser',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(user, session) {
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.next = 2;
								return this.logoutUser();

							case 2:
								this.user = user;
								this.session = session;

							case 4:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function setUser(_x, _x2) {
				return ref.apply(this, arguments);
			}

			return setUser;
		}()
	}, {
		key: 'logoutUser',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								if (!this.session) {
									_context2.next = 3;
									break;
								}

								_context2.next = 3;
								return this.session.close();

							case 3:
								this.user = null;
								this.session = null;

							case 5:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function logoutUser() {
				return ref.apply(this, arguments);
			}

			return logoutUser;
		}()
	}, {
		key: 'onRequest',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(request) {
				var _this2 = this;

				var tasks, id, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, task, responses;

				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								tasks = request.tasks;
								id = request.id;

								tasks = tasks.map(function (options) {
									return new _task2.default(_this2, options);
								});
								_iteratorNormalCompletion = true;
								_didIteratorError = false;
								_iteratorError = undefined;
								_context3.prev = 6;
								_iterator = tasks[Symbol.iterator]();

							case 8:
								if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
									_context3.next = 15;
									break;
								}

								task = _step.value;
								_context3.next = 12;
								return task.run();

							case 12:
								_iteratorNormalCompletion = true;
								_context3.next = 8;
								break;

							case 15:
								_context3.next = 21;
								break;

							case 17:
								_context3.prev = 17;
								_context3.t0 = _context3['catch'](6);
								_didIteratorError = true;
								_iteratorError = _context3.t0;

							case 21:
								_context3.prev = 21;
								_context3.prev = 22;

								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}

							case 24:
								_context3.prev = 24;

								if (!_didIteratorError) {
									_context3.next = 27;
									break;
								}

								throw _iteratorError;

							case 27:
								return _context3.finish(24);

							case 28:
								return _context3.finish(21);

							case 29:
								responses = tasks.map(function (task) {
									return task.toJSON();
								});

								this.sendResponse(responses, id);

							case 31:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this, [[6, 17, 21, 29], [22,, 24, 28]]);
			}));

			function onRequest(_x3) {
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
	}, {
		key: 'error',
		value: function error(code, message) {
			throw new _apiError2.default(code, message);
		}
	}]);

	return Connection;
}();

exports.default = Connection;

//# sourceMappingURL=connection.js.map