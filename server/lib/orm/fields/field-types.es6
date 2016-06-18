import ValidationError from '../validation-error'
import FieldType from './field-type'


export default class FieldTypes extends FieldType {


	constructor(path, type, internal) {
		super(path, type, internal)
	}


	validate(data, basePath) {
		if (this.internal) return
		let array = this.getByPath(data)

		if (!Array.isArray(array)) {
			throw new ValidationError([basePath, this.path], Array, array)
		}

		array.forEach((value, index) => {
			if (!this.validateValue(value)) {
				throw new ValidationError([basePath, this.path, [index]], this.type, value)
			}
		})
	}


	convertToModelValue(array) {
		return array.map(value =>
			super.convertToModelValue(value)
		)
	}


	convertToDocumentValue(array) {
		return array.map(value =>
			super.convertToDocumentValue(value)
		)
	}

}

