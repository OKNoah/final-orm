export default class Params {


	constructor(params, connection) {
		this.connection = connection
		this.params = params
	}


	get(name, type, options) {
		let value = this.params[name]
		this.validateValue(name, value, type, options)
		return value
	}


	error(message) {
		this.connection.error(2, message)
	}


	validateValue(name, value, type, options) {
		switch (type) {

			case  String: {
				if (typeof value !== 'string') {
					this.error(`Поле ${name} должно быть строкой`)
				}

				let min = options.min
				if (min != null && value.length < min) {
					this.error(`Длина поля ${name} должна быть больше или равна ${min}`)
				}

				let max = options.max
				if (max != null && value.length > max) {
					this.error(`Длина поля ${name} должна быть меньше или равна ${max}`)
				}

				let test = options.test
				if (test != null && !test.test(value)) {
					this.error(`Поле ${name} не корректно`)
				}

			}
		}
	}


}


