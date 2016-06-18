import Model from './model'
import FieldType from './fields/field-type'
import FieldTypes from './fields/field-types'
import FieldSchemas from './fields/field-schemas'
import FieldModel from './fields/field-model'
import FieldModels from './fields/field-models'


export default class Schema {


	constructor(userSchema, isRootSchema = true) {
		this.fields = this.parseUserSchema(userSchema)

		if (isRootSchema) {
			this.fields.push(new FieldType(['_id'], String, true))
			this.fields.push(new FieldType(['_key'], String, true))
			this.fields.push(new FieldType(['_rev'], String, true))
			this.fields.push(new FieldType(['_removed'], Boolean, true))
			// TODO сделать проверку что не может иметь такие то свойства
		}

	}


	parseUserSchema(userSchema, basePath = []) {
		let fields = []

		for (let key in userSchema) if (userSchema.hasOwnProperty(key)) {
			let value = userSchema[key]
			let path = basePath.concat([key])

			if (typeof value === 'function') {
				if (value.prototype instanceof Model) {
					fields.push(new FieldModel(path, value))
				} else {
					fields.push(new FieldType(path, value))
				}

			} else if (Array.isArray(value)) {
				let firstItem = value[0]

				if (typeof firstItem === 'function') {

					if (firstItem.prototype instanceof Model) {
						fields.push(new FieldModels(path, firstItem))
					} else {
						fields.push(new FieldTypes(path, firstItem))
					}

				} else {
					fields.push(new FieldSchemas(path, firstItem))
				}

			} else {
				let subFields = this.parseUserSchema(value, path)
				fields.push(...subFields)
			}
		}

		return fields
	}


	validate(data, basePath = []) {
		this.fields.forEach(field =>
			field.validate(data, basePath)
		)
	}


	documentToModel(model, document) {
		this.fields.forEach(field => {
			field.documentToModel(model, document)
		})
		return model
	}


	modelToDocument(model, document) {
		this.fields.forEach(field => {
			field.modelToDocument(model, document)
		})
		return document
	}

}

