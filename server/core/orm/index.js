'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// TODO сделать нормальный коннекшен и драйвера
exports.default = {
	connect: function connect(options) {
		var _class, _temp;

		return _temp = _class = function (_Model) {
			_inherits(_class, _Model);

			function _class() {
				_classCallCheck(this, _class);

				return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
			}

			return _class;
		}(_model2.default), _class.options = options, _temp;
	}
};

//# sourceMappingURL=index.js.map