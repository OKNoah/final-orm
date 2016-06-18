import ValidationError from '../validation-error'
import Field from './field'


export default class FieldType extends Field {


	constructor(path, type, internal = false) {
		super(path, internal)
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
		let isValid = this.validateValue(value)

		if (!isValid) {
			throw new ValidationError([basePath, this.path], this.type, value)
		}
	}


	validateValue(value) {
		let type = this.type

		switch (type) {
			case String:
				return typeof value === 'string'
			case Number:
				return typeof value === 'number'
			case Boolean:
				return typeof value === 'boolean'
			default:
				return value instanceof type
		}

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



