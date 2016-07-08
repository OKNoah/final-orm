'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Params = function () {
	function Params(params, connection) {
		_classCallCheck(this, Params);

		this.connection = connection;
		this.params = params;
	}

	_createClass(Params, [{
		key: 'get',
		value: function get(name, type, options) {
			var value = this.params[name];
			this.validateValue(name, value, type, options);
			return value;
		}
	}, {
		key: 'error',
		value: function error(message) {
			this.connection.error(2, message);
		}
	}, {
		key: 'validateValue',
		value: function validateValue(name, value, type, options) {
			switch (type) {

				case String:
					{
						if (typeof value !== 'string') {
							this.error('Поле ' + name + ' должно быть строкой');
						}

						var min = options.min;
						if (min != null && value.length < min) {
							this.error('Длина поля ' + name + ' должна быть больше или равна ' + min);
						}

						var max = options.max;
						if (max != null && value.length > max) {
							this.error('Длина поля ' + name + ' должна быть меньше или равна ' + max);
						}

						var test = options.test;
						if (test != null && !test.test(value)) {
							this.error('Поле ' + name + ' не корректно');
						}
					}
			}
		}
	}]);

	return Params;
}();

exports.default = Params;

//# sourceMappingURL=params.js.map