export default class ApiError {

	static textCodes = {
		0: 'Внутренняя ошибка сервера',
		1: 'Неизвестный метод',
		2: 'Ошибка авторизации',
	}

	constructor(code, message) {
		this.code = code
		this.message = message
		this.textCode = ApiError.textCodes[code] || ''
	}

}

