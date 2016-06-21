'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['2 argument isnt stream'], ['2 argument isnt stream']),
    _templateObject2 = _taggedTemplateLiteral(['1 argument isnt stream'], ['1 argument isnt stream']);

var _gm = require('gm');

var _gm2 = _interopRequireDefault(_gm);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rmdir = require('rmdir');

var _rmdir2 = _interopRequireDefault(_rmdir);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
	function Utils() {
		_classCallCheck(this, Utils);
	}

	_createClass(Utils, null, [{
		key: '_save',
		value: function _save(filepath, stream) {
			return new Promise(function (resolve, reject) {
				if (!stream) throw Error(_templateObject);

				(0, _mkdirp2.default)(_path2.default.dirname(filepath), function (error) {
					if (error) reject(error);
					var writeStream = _fs2.default.createWriteStream(filepath);
					stream.pipe(writeStream);
					stream.on('end', resolve);
					stream.on('error', reject);
					writeStream.on('error', reject);
				});
			});
		}
	}, {
		key: 'removeDir',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(dirpath) {
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								return _context.abrupt('return', new Promise(function (resolve, reject) {
									if (!dirpath) return resolve();
									(0, _rmdir2.default)(dirpath, function () {
										resolve();
									});
								}));

							case 1:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function removeDir(_x) {
				return ref.apply(this, arguments);
			}

			return removeDir;
		}()
	}, {
		key: 'createRandomString',
		value: function createRandomString() {
			var length = arguments.length <= 0 || arguments[0] === undefined ? 64 : arguments[0];

			return _crypto2.default.randomBytes(length).toString('hex');
		}
	}, {
		key: 'saveFile',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(stream, ext) {
				var storagePath, folderName, fileName, filePath, fileUrl;
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								if (stream) {
									_context2.next = 2;
									break;
								}

								throw Error(_templateObject2);

							case 2:
								storagePath = _config2.default.storage;
								folderName = this.createRandomString(64);
								fileName = this.createRandomString(5) + ('.' + ext);
								filePath = _path2.default.join(storagePath, folderName, fileName);
								fileUrl = folderName + '/' + fileName;
								_context2.next = 9;
								return this._save(filePath, stream);

							case 9:
								return _context2.abrupt('return', fileUrl);

							case 10:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function saveFile(_x3, _x4) {
				return ref.apply(this, arguments);
			}

			return saveFile;
		}()
	}, {
		key: 'remove',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(fileUrl) {
				var storagePath, dirPath;
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								if (fileUrl) {
									_context3.next = 2;
									break;
								}

								return _context3.abrupt('return');

							case 2:
								storagePath = _config2.default.storage;
								dirPath = _path2.default.join(storagePath, _path2.default.parse(fileUrl).dir);
								_context3.next = 6;
								return this.removeDir(dirPath);

							case 6:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function remove(_x5) {
				return ref.apply(this, arguments);
			}

			return remove;
		}()
	}, {
		key: 'resizeImage',
		value: function resizeImage(stream, ext) {
			var width = arguments.length <= 2 || arguments[2] === undefined ? 1024 : arguments[2];
			var height = arguments.length <= 3 || arguments[3] === undefined ? 1024 : arguments[3];

			return (0, _gm2.default)(stream, 'img.' + ext).resize(width, height, '!').stream();
		}
	}, {
		key: 'saveImage',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(stream, ext) {
				var width = arguments.length <= 2 || arguments[2] === undefined ? 1024 : arguments[2];
				var height = arguments.length <= 3 || arguments[3] === undefined ? 1024 : arguments[3];
				var gmStream;
				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								gmStream = this.resizeImage(stream, ext, width, height);
								_context4.next = 3;
								return this.saveFile(gmStream, ext);

							case 3:
								return _context4.abrupt('return', _context4.sent);

							case 4:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function saveImage(_x8, _x9, _x10, _x11) {
				return ref.apply(this, arguments);
			}

			return saveImage;
		}()
	}]);

	return Utils;
}();

exports.default = Utils;

//# sourceMappingURL=utils.js.map