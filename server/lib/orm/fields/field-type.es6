import Field from './field'


export default class FieldType extends Field {


	constructor(basePath, path, type, options, internal = false) {
		super(basePath, path, options, internal)
		this.type = type
		this.checkType(type)
	}


	checkType(type) {
		if (type === Boolean) return
		if (type === String) return
		if (type === Number) return
		if (type === Date) return

		if (!type.prototype.toJSON) {
			throw Error(`Custom Type ${type.name} must have method toJSON()`)
		}

		if (!type.fromJSON) {
			throw Error(`Custom Type ${type.name} must have static method 'fromJSON': ${type.name}.fromJSON(document)`)
		}
	}


	validate(data, basePath) {
		if (this.internal) return

		let value = this.getByPath(data)
		if (!this.validateValue(value, basePath)) {
			this.typeError(this.type, value)
		}
	}


	validateValue(value, basePath) {
		let type = this.type

		switch (type) {
			case String:
				return typeof value === 'string'
			case Number:
				return this.validateNumber(value, basePath)
			case Boolean:
				return typeof value === 'boolean'
			default:
				return value instanceof type
		}

	}


	validateNumber(value, basePath) {
		if (typeof value !== 'number') return false
		let options = this.options


		if ('min' in options) if (value < options.min) {
			console.log(111111111111111111111)
			// throw new ValidationRangeError([basePath, this.path], `RANGE`)
		}
		// if ('max' in options) if (value > options.max) return false
		return true
	}


	convertToModelValue(value) {
		if (value == null) return value
		let type = this.type

		switch (type) {
			case String:
				return String(value)
			case Number:
				return Number(value)
			case Boolean:
				return Boolean(value)
			case Date:
				return new Date(value)
		}

		return type.fromJSON(value)
	}


	convertToDocumentValue(value) {
		if (value == null) return value

		switch (this.type) {
			case String:
				return value
			case Number:
				return value
			case Boolean:
				return value
			case Date:
				return value.getTime()
		}

		return value.toJSON()
	}


}



