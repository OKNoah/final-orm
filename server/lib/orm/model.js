'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('arangojs');

var Database = _require.Database;
var Model = (_temp = _class = function () {
	function Model() {
		_classCallCheck(this, Model);
	}

	_createClass(Model, [{
		key: 'save',


		/******************* public methods *******************/

		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								return _context.abrupt('return', this.constructor.save(this));

							case 1:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function save() {
				return ref.apply(this, arguments);
			}

			return save;
		}()
	}, {
		key: 'update',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								return _context2.abrupt('return', this.constructor.update(this));

							case 1:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function update() {
				return ref.apply(this, arguments);
			}

			return update;
		}()
	}, {
		key: 'remove',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								return _context3.abrupt('return', this.constructor.remove(this));

							case 1:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function remove() {
				return ref.apply(this, arguments);
			}

			return remove;
		}()
	}, {
		key: 'restore',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								return _context4.abrupt('return', this.constructor.restore(this));

							case 1:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function restore() {
				return ref.apply(this, arguments);
			}

			return restore;
		}()
	}], [{
		key: '_getSchema',
		// db config
		value: function _getSchema() {
			if (!this._normalSchema) {
				this._normalSchema = new _schema2.default(this.schema);
			}
			return this._normalSchema;
		} // user schema

	}, {
		key: '_getDatabase',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
				var db;
				return regeneratorRuntime.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								if (!Model._database) {
									_context5.next = 2;
									break;
								}

								return _context5.abrupt('return', Model._database);

							case 2:
								db = new Database();
								_context5.prev = 3;
								_context5.next = 6;
								return db.createDatabase(Model.config.database);

							case 6:
								_context5.next = 10;
								break;

							case 8:
								_context5.prev = 8;
								_context5.t0 = _context5['catch'](3);

							case 10:

								db.useDatabase(Model.config.database);
								return _context5.abrupt('return', Model._database = db);

							case 12:
							case 'end':
								return _context5.stop();
						}
					}
				}, _callee5, this, [[3, 8]]);
			}));

			function _getDatabase() {
				return ref.apply(this, arguments);
			}

			return _getDatabase;
		}()
	}, {
		key: '_getCollection',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
				var db, collection;
				return regeneratorRuntime.wrap(function _callee6$(_context6) {
					while (1) {
						switch (_context6.prev = _context6.next) {
							case 0:
								if (!this._collection) {
									_context6.next = 2;
									break;
								}

								return _context6.abrupt('return', this._collection);

							case 2:
								_context6.next = 4;
								return this._getDatabase();

							case 4:
								db = _context6.sent;
								collection = db.collection(this.name);
								_context6.prev = 6;
								_context6.next = 9;
								return collection.create();

							case 9:
								_context6.next = 13;
								break;

							case 11:
								_context6.prev = 11;
								_context6.t0 = _context6['catch'](6);

							case 13:
								return _context6.abrupt('return', this._collection = collection);

							case 14:
							case 'end':
								return _context6.stop();
						}
					}
				}, _callee6, this, [[6, 11]]);
			}));

			function _getCollection() {
				return ref.apply(this, arguments);
			}

			return _getCollection;
		}()
	}, {
		key: '_call',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(method) {
				var collection,
				    _len,
				    args,
				    _key,
				    _args7 = arguments;

				return regeneratorRuntime.wrap(function _callee7$(_context7) {
					while (1) {
						switch (_context7.prev = _context7.next) {
							case 0:
								_context7.prev = 0;
								_context7.next = 3;
								return this._getCollection();

							case 3:
								collection = _context7.sent;

								if (collection[method]) {
									_context7.next = 6;
									break;
								}

								throw Error('Collection has not method \'' + method + '\'');

							case 6:
								for (_len = _args7.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
									args[_key - 1] = _args7[_key];
								}

								_context7.next = 9;
								return collection[method].apply(collection, args);

							case 9:
								return _context7.abrupt('return', _context7.sent);

							case 12:
								_context7.prev = 12;
								_context7.t0 = _context7['catch'](0);

								console.error(_context7.t0);

							case 15:
							case 'end':
								return _context7.stop();
						}
					}
				}, _callee7, this, [[0, 12]]);
			}));

			function _call(_x, _x2) {
				return ref.apply(this, arguments);
			}

			return _call;
		}()
	}, {
		key: '_validate',
		value: function _validate(data) {
			var schema = this._getSchema();
			schema.validate(data);
		}
	}, {
		key: '_getDocument',
		value: function _getDocument(documentHandle) {
			return this._call('document', documentHandle);
		}
	}, {
		key: '_getDocuments',
		value: function _getDocuments(documentHandles) {
			return this._call('lookupByKeys', documentHandles);
		}
	}, {
		key: '_createModelByDocument',
		value: function _createModelByDocument(document) {
			var model = Object.create(this.prototype);
			this._documentToModel(model, document);
			model.constructor();
			return model;
		}
	}, {
		key: '_documentToModel',
		value: function _documentToModel(model, document) {
			var schema = this._getSchema();
			schema.documentToModel(model, document);
			return model;
		}
	}, {
		key: '_modelToDocument',
		value: function _modelToDocument(model) {
			var schema = this._getSchema();
			var document = {};
			schema.modelToDocument(model, document);
			return document;
		}

		/******************* public static methods *******************/

	}, {
		key: 'add',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(data) {
				var documentHandle, document;
				return regeneratorRuntime.wrap(function _callee8$(_context8) {
					while (1) {
						switch (_context8.prev = _context8.next) {
							case 0:
								this._validate(data);
								data = this._modelToDocument(data);
								data._removed = false;
								_context8.next = 5;
								return this._call('save', data);

							case 5:
								documentHandle = _context8.sent;
								_context8.next = 8;
								return this._call('document', documentHandle);

							case 8:
								document = _context8.sent;
								return _context8.abrupt('return', this._createModelByDocument(document));

							case 10:
							case 'end':
								return _context8.stop();
						}
					}
				}, _callee8, this);
			}));

			function add(_x3) {
				return ref.apply(this, arguments);
			}

			return add;
		}()
	}, {
		key: 'get',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(documentHandle) {
				var document;
				return regeneratorRuntime.wrap(function _callee9$(_context9) {
					while (1) {
						switch (_context9.prev = _context9.next) {
							case 0:
								_context9.next = 2;
								return this._getDocument(documentHandle);

							case 2:
								document = _context9.sent;
								return _context9.abrupt('return', this._createModelByDocument(document));

							case 4:
							case 'end':
								return _context9.stop();
						}
					}
				}, _callee9, this);
			}));

			function get(_x4) {
				return ref.apply(this, arguments);
			}

			return get;
		}()
	}, {
		key: 'getArr',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(documentHandles) {
				var _this = this;

				var documents;
				return regeneratorRuntime.wrap(function _callee10$(_context10) {
					while (1) {
						switch (_context10.prev = _context10.next) {
							case 0:
								_context10.next = 2;
								return this._getDocuments(documentHandles);

							case 2:
								documents = _context10.sent;
								return _context10.abrupt('return', documents.map(function (document) {
									return _this._createModelByDocument(document);
								}));

							case 4:
							case 'end':
								return _context10.stop();
						}
					}
				}, _callee10, this);
			}));

			function getArr(_x5) {
				return ref.apply(this, arguments);
			}

			return getArr;
		}()
	}, {
		key: 'save',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(model) {
				var document, newHandle;
				return regeneratorRuntime.wrap(function _callee11$(_context11) {
					while (1) {
						switch (_context11.prev = _context11.next) {
							case 0:
								this._validate(model);
								document = this._modelToDocument(model);
								_context11.next = 4;
								return this._call('update', model._id, document);

							case 4:
								newHandle = _context11.sent;

								model._rev = newHandle._rev;
								return _context11.abrupt('return', model);

							case 7:
							case 'end':
								return _context11.stop();
						}
					}
				}, _callee11, this);
			}));

			function save(_x6) {
				return ref.apply(this, arguments);
			}

			return save;
		}()
	}, {
		key: 'update',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee12(model) {
				var document;
				return regeneratorRuntime.wrap(function _callee12$(_context12) {
					while (1) {
						switch (_context12.prev = _context12.next) {
							case 0:
								_context12.next = 2;
								return this._getDocument(model);

							case 2:
								document = _context12.sent;

								this._documentToModel(model, document);
								return _context12.abrupt('return', model);

							case 5:
							case 'end':
								return _context12.stop();
						}
					}
				}, _callee12, this);
			}));

			function update(_x7) {
				return ref.apply(this, arguments);
			}

			return update;
		}()
	}, {
		key: 'remove',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee13(model) {
				return regeneratorRuntime.wrap(function _callee13$(_context13) {
					while (1) {
						switch (_context13.prev = _context13.next) {
							case 0:
								model._removed = true;
								return _context13.abrupt('return', this.save(model));

							case 2:
							case 'end':
								return _context13.stop();
						}
					}
				}, _callee13, this);
			}));

			function remove(_x8) {
				return ref.apply(this, arguments);
			}

			return remove;
		}()
	}, {
		key: 'restore',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee14(model) {
				return regeneratorRuntime.wrap(function _callee14$(_context14) {
					while (1) {
						switch (_context14.prev = _context14.next) {
							case 0:
								model._removed = false;
								return _context14.abrupt('return', this.save(model));

							case 2:
							case 'end':
								return _context14.stop();
						}
					}
				}, _callee14, this);
			}));

			function restore(_x9) {
				return ref.apply(this, arguments);
			}

			return restore;
		}()
	}, {
		key: 'select',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee15(selector) {
				var _this2 = this;

				var skip = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
				var limit = arguments.length <= 2 || arguments[2] === undefined ? 100 : arguments[2];
				var cursor, documents;
				return regeneratorRuntime.wrap(function _callee15$(_context15) {
					while (1) {
						switch (_context15.prev = _context15.next) {
							case 0:
								limit = Math.min(Math.max(limit, 0), 100);
								selector._removed = false;
								_context15.next = 4;
								return this._call('byExample', selector, { skip: skip, limit: limit });

							case 4:
								cursor = _context15.sent;
								_context15.next = 7;
								return cursor.all();

							case 7:
								documents = _context15.sent;
								return _context15.abrupt('return', documents.map(function (document) {
									return _this2._createModelByDocument(document);
								}));

							case 9:
							case 'end':
								return _context15.stop();
						}
					}
				}, _callee15, this);
			}));

			function select(_x10, _x11, _x12) {
				return ref.apply(this, arguments);
			}

			return select;
		}()
	}]);

	return Model;
}(), _class.config = { database: 'fds' }, _class.schema = null, _class._normalSchema = null, _class._collection = null, _class._database = null, _temp);
exports.default = Model;

//# sourceMappingURL=model.js.map