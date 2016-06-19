import Model from './model'
import FieldType from './fields/field-type'
import FieldTypes from './fields/field-types'
import FieldModel from './fields/field-model'
import FieldModels from './fields/field-models'
import FieldSchemas from './fields/field-schemas'


export default class Schema {


	constructor(userSchema, basePath = [], isRootSchema = true) {
		this.basePath = basePath
		this.fields = this.parseUserSchema(userSchema)

		if (isRootSchema) {
			this.fields.push(new FieldType(basePath, ['_id'], String, null, true))
			this.fields.push(new FieldType(basePath, ['_key'], String, null, true))
			this.fields.push(new FieldType(basePath, ['_rev'], String, null, true))
			this.fields.push(new FieldType(basePath, ['_removed'], Boolean, null, true))
			// TODO сделать проверку что не может иметь свойства save remove и начинающиеся
			// с подчеркивания _
		}

	}


	parseUserSchema(userSchema, parentPath = []) {
		let fields = []

		for (let key in userSchema) if (userSchema.hasOwnProperty(key)) {
			let path = [...parentPath, key]
			let value = userSchema[key]

			if ('$type' in value) {
				var options = value
				value = value.$type
			}

			if (typeof value === 'function') {
				if (value.prototype instanceof Model) {
					fields.push(new FieldModel(this.basePath, path, value, options))
				} else {
					fields.push(new FieldType(this.basePath, path, value, options))
				}

			} else if (Array.isArray(value)) {
				let firstItem = value[0]

				if (typeof firstItem === 'function') {

					if (firstItem.prototype instanceof Model) {
						fields.push(new FieldModels(this.basePath, path, firstItem, options))
					} else {
						fields.push(new FieldTypes(this.basePath, path, firstItem, options))
					}

				} else {
					fields.push(new FieldSchemas(this.basePath, path, firstItem, options))
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

