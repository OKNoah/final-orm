'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ListApi = exports.Api = exports.Item = exports.List = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _iridium = require('iridium');

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var List = exports.List = function (_Model) {
	_inherits(List, _Model);

	function List(InstanceClass, ApiClass) {
		_classCallCheck(this, List);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(List).call(this, _db2.default, InstanceClass));

		if (ApiClass) {
			var api = new ApiClass(_this);
			_server2.default.addApi(api);
		}
		return _this;
	}

	_createClass(List, [{
		key: 'add',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(data) {
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								return _context.abrupt('return', this.insert(data));

							case 1:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function add(_x) {
				return ref.apply(this, arguments);
			}

			return add;
		}()
	}, {
		key: 'slice',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
				var skip = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
				var limit = arguments.length <= 1 || arguments[1] === undefined ? 100 : arguments[1];
				var cursor, count, documents;
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								limit = Math.max(0, Math.min(limit, 100));
								cursor = this.find();
								_context2.next = 4;
								return cursor.count();

							case 4:
								count = _context2.sent;
								_context2.next = 7;
								return cursor.skip(skip).limit(limit).toArray();

							case 7:
								documents = _context2.sent;
								return _context2.abrupt('return', {
									documents: documents,
									count: count
								});

							case 9:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function slice(_x2, _x3) {
				return ref.apply(this, arguments);
			}

			return slice;
		}()
	}]);

	return List;
}(_iridium.Model);

var Item = exports.Item = function (_Instance) {
	_inherits(Item, _Instance);

	function Item() {
		_classCallCheck(this, Item);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Item).apply(this, arguments));
	}

	_createClass(Item, [{
		key: 'set',


		// @Property(true)
		// name:
		//
		// @Property(])
		// friends

		value: function set(data) {
			var _this3 = this;

			for (var _len = arguments.length, props = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				props[_key - 1] = arguments[_key];
			}

			props.forEach(function (prop) {
				var value = data[prop];
				if (prop in data) _this3[prop] = value;
			});
		}
	}]);

	return Item;
}(_iridium.Instance);

var Api = exports.Api = function (_ref) {
	_inherits(Api, _ref);

	function Api(list) {
		_classCallCheck(this, Api);

		var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Api).call(this));

		_this4.list = list;
		return _this4;
	}

	_createClass(Api, null, [{
		key: 'getMethodNames',
		value: function getMethodNames(api) {
			var names = [];
			var context = api;
			while (context) {
				var ownNames = Object.getOwnPropertyNames(context);

				for (var i = 0; i < ownNames.length; i++) {
					var ownName = ownNames[i];
					if (names.indexOf(ownName) !== -1) continue;
					if (ownName === 'constructor') continue;
					if (typeof api[ownName] !== 'function') continue;
					names.push(ownName);
				}

				context = Object.getPrototypeOf(context);
			}

			return names;
		}
	}]);

	return Api;
}(null);

var ListApi = exports.ListApi = function (_Api) {
	_inherits(ListApi, _Api);

	function ListApi() {
		_classCallCheck(this, ListApi);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(ListApi).apply(this, arguments));
	}

	_createClass(ListApi, [{
		key: 'slice',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(data) {
				var skip, limit, result, count, documents;
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								skip = data.skip;
								limit = data.limit;
								_context3.next = 4;
								return this.list.slice(skip, limit);

							case 4:
								result = _context3.sent;
								count = result.count;
								documents = result.documents.map(function (document) {
									return document.toJSON();
								});
								return _context3.abrupt('return', {
									count: count,
									documents: documents
								});

							case 8:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function slice(_x6) {
				return ref.apply(this, arguments);
			}

			return slice;
		}()
	}, {
		key: 'add',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(data) {
				var document;
				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								_context4.next = 2;
								return this.list.add(data);

							case 2:
								document = _context4.sent;
								return _context4.abrupt('return', document.toJSON());

							case 4:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function add(_x7) {
				return ref.apply(this, arguments);
			}

			return add;
		}()
	}, {
		key: 'remove',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(data) {
				var _id;

				return regeneratorRuntime.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								_id = data._id;
								return _context5.abrupt('return', this.list.remove({ _id: _id }));

							case 2:
							case 'end':
								return _context5.stop();
						}
					}
				}, _callee5, this);
			}));

			function remove(_x8) {
				return ref.apply(this, arguments);
			}

			return remove;
		}()
	}, {
		key: 'save',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(data) {
				for (var _len2 = arguments.length, propNames = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
					propNames[_key2 - 1] = arguments[_key2];
				}

				var instance;
				return regeneratorRuntime.wrap(function _callee6$(_context6) {
					while (1) {
						switch (_context6.prev = _context6.next) {
							case 0:
								_context6.next = 2;
								return this.list.get(data._id);

							case 2:
								instance = _context6.sent;

								instance.set.apply(instance, [data].concat(propNames));
								_context6.next = 6;
								return instance.save();

							case 6:
								return _context6.abrupt('return', instance.toJSON());

							case 7:
							case 'end':
								return _context6.stop();
						}
					}
				}, _callee6, this);
			}));

			function save(_x9, _x10) {
				return ref.apply(this, arguments);
			}

			return save;
		}()
	}]);

	return ListApi;
}(Api);

//# sourceMappingURL=list.js.map