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
			this.typeError(this.type, value, basePath)
		}
	}


	validateValue(value, basePath) {
		let type = this.type
		let options = this.options

		switch (type) {
			case String:
				return this.validateString(value, options, basePath)
			case Number:
				return this.validateNumber(value, options, basePath)
			case Boolean:
				return typeof value === 'boolean'
			default:
				return value instanceof type
		}

	}


	validateNumber(value, options, basePath) {
		if (typeof value !== 'number') return false

		if (!Number.isFinite(value)) {
			this.throwError(`must be finite number, but have ${value}`, basePath)
		}
		if ('min' in options) if (value < options.min) {
			this.throwError(`must be more or equal ${options.min}, but have ${value}`, basePath)
		}
		if ('max' in options) if (value > options.max) {
			this.throwError(`must be less or equal ${options.max}, but have ${value}`, basePath)
		}
		return true
	}


	validateString(value, options, basePath) {
		if (typeof value !== 'string') return false

		if ('test' in options) if (!options.test.test(value)) {
			this.throwError(`must be match regExp ${options.test}, but have '${value}'`, basePath)
		}
		if ('min' in options) if (value.length < options.min) {
			this.throwError(`length must be more or equal ${options.min} symbols, but have '${value}'`, basePath)
		}
		if ('max' in options) if (value.length > options.max) {
			this.throwError(`length must be less or equal ${options.max} symbols, but have '${value}'`, basePath)
		}
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

		// for custom types
		return value.toJSON()
	}


}



