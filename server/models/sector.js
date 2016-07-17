'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _model = require('../core/model');

var _model2 = _interopRequireDefault(_model);

var _utils = require('../core/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sector = function (_Model) {
	_inherits(Sector, _Model);

	function Sector() {
		_classCallCheck(this, Sector);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Sector).apply(this, arguments));
	}

	_createClass(Sector, null, [{
		key: 'add',
		value: function () {
			var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref) {
				var name = _ref.name;
				var bg = _ref.bg;
				var contentBg = _ref.contentBg;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.next = 2;
								return _utils2.default.saveImage(bg, 'jpg');

							case 2:
								bg = _context.sent;
								_context.next = 5;
								return _utils2.default.saveImage(contentBg, 'jpg');

							case 5:
								contentBg = _context.sent;
								return _context.abrupt('return', _get(Object.getPrototypeOf(Sector), 'add', this).call(this, { name: name, bg: bg, contentBg: contentBg }));

							case 7:
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
	}]);

	return Sector;
}(_model2.default);

Sector.schema = {
	name: String,
	bg: String,
	contentBg: String
};
exports.default = Sector;

//# sourceMappingURL=sector.js.map