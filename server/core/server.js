'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Request = exports.Server = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _list = require('./list');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _socket = require('socket.io-stream');

var _socket2 = _interopRequireDefault(_socket);

var _socket3 = require('socket.io');

var _socket4 = _interopRequireDefault(_socket3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = exports.Server = function () {
	function Server(port) {
		_classCallCheck(this, Server);

		this.io = (0, _socket4.default)(port, {});
		this.methods = {};
		this.initHandlers();
	}

	_createClass(Server, [{
		key: 'initHandlers',
		value: function initHandlers() {
			this.io.on('connection', this.onConnection.bind(this));
		}
	}, {
		key: 'onConnection',
		value: function onConnection(socket) {
			var socketStream = (0, _socket2.default)(socket);
			socketStream.on('request', this.onRequest.bind(this, socketStream));
		}
	}, {
		key: 'onRequest',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(socket, request) {
				var data, method, response, result;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								data = request.data;
								method = request.method;
								response = new Request(socket, request);
								_context.prev = 3;
								_context.next = 6;
								return this.callApi(method, data, response);

							case 6:
								result = _context.sent;

								response.send(result);
								_context.next = 13;
								break;

							case 10:
								_context.prev = 10;
								_context.t0 = _context['catch'](3);

								response.serverError(_context.t0);

							case 13:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this, [[3, 10]]);
			}));

			function onRequest(_x, _x2) {
				return ref.apply(this, arguments);
			}

			return onRequest;
		}()
	}, {
		key: 'callApi',
		value: function callApi(methodName, data, request) {
			methodName = methodName.toLowerCase();
			var method = this.methods[methodName];
			if (!method) {
				request.error('Unknown method "' + methodName + '"');
				return;
			}
			return method.call(data, request);
		}
	}, {
		key: 'addApi',
		value: function addApi(api) {
			var _this = this;

			var keys = _list.Api.getMethodNames(api);

			keys.forEach(function (key) {
				var func = api[key];
				var methodName = (api.name + '.' + key).toLowerCase();
				_this.methods[methodName] = new Method(func, api);
			});
		}
	}]);

	return Server;
}();

var Method = function () {
	function Method(func, context) {
		_classCallCheck(this, Method);

		this.func = func;
		this.context = context;
	}

	_createClass(Method, [{
		key: 'call',
		value: function call(data, request) {
			return this.func.call(this.context, data, request);
		}
	}]);

	return Method;
}();

var Request = function () {
	function Request(socket, requestData) {
		_classCallCheck(this, Request);

		this.socket = socket;
		this.requestData = requestData;
		this.completed = false;
	}

	_createClass(Request, [{
		key: 'send',
		value: function send(data) {
			if (this.completed) return;
			this.completed = true;
			this.sendData('response', data);
		}
	}, {
		key: 'error',
		value: function error(message) {
			if (this.completed) return;
			this.completed = true;
			this.sendData('err', message);
		}
	}, {
		key: 'serverError',
		value: function serverError(error) {
			console.error(error);
			this.error('Internal server error');
		}
	}, {
		key: 'progress',
		value: function progress(_progress) {
			if (this.completed) return;
			this.sendData('progress', _progress);
		}
	}, {
		key: 'sendData',
		value: function sendData(type, data) {
			var requestId = this.requestData.requestId;

			this.socket.emit(type, {
				requestId: requestId,
				data: data
			});
		}
	}]);

	return Request;
}();

exports.Request = Request;


var server = new Server(_config2.default.port);
exports.default = server;

//# sourceMappingURL=server.js.map