'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _apiError = require('./errors/api-error');

var _apiError2 = _interopRequireDefault(_apiError);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Task = function () {
	function Task(connection, options) {
		_classCallCheck(this, Task);

		this.connection = connection;
		this.method = options.method;
		this.params = options.params;

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
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
				var result;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.prev = 0;
								_context.next = 3;
								return _server2.default.callMethod(this.method, this.params, this.connection);

							case 3:
								result = _context.sent;
								_context.next = 10;
								break;

							case 6:
								_context.prev = 6;
								_context.t0 = _context['catch'](0);

								if (!(_context.t0 instanceof _apiError2.default)) {
									console.error(_context.t0);
									_context.t0 = new _apiError2.default(0, '');
								}
								this.reject(_context.t0);

							case 10:
								this.resolve(result);

							case 11:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this, [[0, 6]]);
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

exports.default = Task;

//# sourceMappingURL=task.js.map