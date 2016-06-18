import ValidationError from '../validation-error'
import Schema from '../schema'
import Field from './field'


export default class FieldSchemas extends Field {


	constructor(path, userSchema, internal) {
		super(path, internal)
		this.schema = new Schema(userSchema, false)
	}


	validate(data, basePath) {
		if (this.internal) return
		let array = this.getByPath(data)

		if (!Array.isArray(array)) {
			throw new ValidationError([basePath, this.path], Array, array)
		}

		array.forEach((value, index) => {
			let subPath = basePath.concat(this.path, [index])
			this.schema.validate(value, subPath)
		})

	}


	convertToModelValue(array) {
		return array.map(document => {
			let model = {}
			return this.schema.documentToModel(model, document)
		})
	}


	convertToDocumentValue(array) {
		return array.map(model => {
			let document = {}
			return this.schema.modelToDocument(model, document)
		})
	}

}

