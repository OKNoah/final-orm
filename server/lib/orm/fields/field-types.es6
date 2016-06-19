import FieldType from './field-type'


export default class FieldTypes extends FieldType {


	constructor(basePath, path, type, options, internal) {
		super(basePath, path, type, options, internal)
	}


	validate(data, basePath) {
		if (this.internal) return
		let array = this.getByPath(data)

		if (!Array.isArray(array)) {
			this.typeError(Array, array)
		}

		array.forEach((value, index) => {
			if (!this.validateValue(value)) {
				this.typeError(this.type, value, [index])
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

