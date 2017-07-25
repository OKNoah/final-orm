import Field from './field'

export default class FieldType extends Field {
	constructor (basePath, path, type, options, internal = false) {
		super(basePath, path, options, internal)
		this.checkType(type)
		this.type = type
	}

	checkType (type) {
		if (type === Boolean) return
		if (type === String) return
		if (type === Number) return
		if (type === Date) return
		if (type === Set) return

		if (!type.prototype.toJSON) {
			throw Error(`Custom type '${type.name}' must have method 'toJSON'`)
		}
		if (!type.fromJSON) {
			throw Error(`Custom type '${type.name}' must have static method 'fromJSON'`)
		}
	}

	validate (data, basePath) {
		if (this.internal) return
		let value = this.getByPath(data)

		if (this.isOptional(value)) return

		if (!this.validateValue(value, basePath)) {
			this.typeError(this.type, value, basePath)
		}
	}

	validateValue (value, basePath) {
		let type = this.type
		let options = this.options

		if ('enum' in options) {
			this.validateEnum(value, options, basePath)
		}

		switch (type) {
			case String:
				return this.validateString(value, options, basePath)
			case Number:
				return this.validateNumber(value, options, basePath)
			case Boolean:
				return typeof value === 'boolean'
			case Set:
				return this.validateSet(value, options, basePath)
			default:
				return value instanceof type
		}
	}

	validateNumber (value, options, basePath) {
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

	validateString (value, options, basePath) {
		if (typeof value !== 'string') return false

		if ('regExp' in options) if (!options.regExp.test(value)) {
			this.throwError(`must be match regExp ${options.regExp}, but have '${value}'`, basePath)
		}
		if ('min' in options) if (value.length < options.min) {
			this.throwError(`length must be more or equal ${options.min} symbols, but have '${value}'`, basePath)
		}
		if ('max' in options) if (value.length > options.max) {
			this.throwError(`length must be less or equal ${options.max} symbols, but have '${value}'`, basePath)
		}
		return true
	}

	validateEnum (value, options, basePath) {
		let enums = options.enum
		if (enums.indexOf(value) === -1) {
			let enumText = JSON.stringify(enums)
			let valueText = this.valueToString(value)
			let message = `must be one of enum ${enumText}, but have ${valueText}`
			this.throwError(message, basePath)
		}
	}

	validateSet (value, options, basePath) {
		if (!(value instanceof Set)) return false
		if ('set' in options) {
			let sets = options.set
			value.forEach(item => {
				if (sets.indexOf(item) === -1) {
					let setText = JSON.stringify(sets)
					let itemValue = this.valueToString(item)
					let message = `must contain item only from ${setText}, but have ${itemValue}`
					this.throwError(message, basePath)
				}
			})
		}
		return true
	}

	convertToModelValue (value) {
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
			case Set:
				return new Set(value)
		}

		return type.fromJSON(value)
	}

	convertToDocumentValue (value) {
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
			case Set:
				return Array.from(value)
		}

		// for custom types
		return value.toJSON()
	}
}
