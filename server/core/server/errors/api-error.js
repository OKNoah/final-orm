'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApiError = function ApiError(code, message) {
	_classCallCheck(this, ApiError);

	this.code = code;
	this.message = message;
	this.textCode = ApiError.textCodes[code] || '';
};

ApiError.textCodes = {
	0: 'Внутренняя ошибка сервера',
	1: 'Неизвестный метод',
	2: 'Ошибка авторизации'
};
exports.default = ApiError;

//# sourceMappingURL=api-error.js.map