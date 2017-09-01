import FieldType from './field-type'


export default class FieldTypes extends FieldType {
	constructor (basePath, path, type, options, internal) {
		super(basePath, path, type, options, internal)
	}

	validate (data, basePath) {
		if (this.internal) return
		let array = this.getByPath(data)
		if (!array && this.options.optional) {
			return
		}

		if (!Array.isArray(array)) {
			this.typeError(Array, array, basePath)
		}

		array.forEach((value, index) => {
			if (!this.validateValue(value)) {
				this.typeError(this.type, value, basePath, [index])
			}
		})
	}

	convertToModelValue (array) {
		if (!array) {
			return
		}

		return array.map(value =>
			super.convertToModelValue(value)
		)
	}

	convertToDocumentValue (array) {
		if (!array) {
			return
		}

		return array.map(value =>
			super.convertToDocumentValue(value)
		)
	}
}

