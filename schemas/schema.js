import Model from '../models/model'
import FieldType from '../fields/field-type'
import FieldTypes from '../fields/field-types'
import FieldModel from '../fields/field-model'
import FieldModels from '../fields/field-models'
import FieldSchemas from '../fields/field-schemas'

export default class Schema {
  constructor (userSchema = null, basePath = [], isRootSchema = true) {
    this.basePath = basePath
    this.fields = this.parseUserSchema(userSchema)

    if (isRootSchema) {
      this.fields.push(new FieldType(basePath, ['_id'], String, null, true))
      this.fields.push(new FieldType(basePath, ['_key'], String, null, true))
      this.fields.push(new FieldType(basePath, ['_rev'], String, null, true))
      this.fields.push(new FieldType(basePath, ['_removed'], Boolean, null, true))
    }
  }

  parseUserSchema (userSchema, parentPath = []) {
    const basePath = this.basePath
    const fields = []

    for (const key in userSchema) {
      if (userSchema.hasOwnProperty(key)) {
        const path = [...parentPath, key]
        let value = userSchema[key]

        if ('$type' in value) {
          var options = value
          value = value.$type
        } else {
          options = {}
        }

        if (typeof value === 'function') {
          if (value.prototype instanceof Model) {
            fields.push(new FieldModel(basePath, path, value, options))
          } else {
            fields.push(new FieldType(basePath, path, value, options))
          }

        } else if (Array.isArray(value)) {

          const firstItem = value[0]
          if (typeof firstItem === 'function') {
            if (firstItem.prototype instanceof Model) {
              fields.push(new FieldModels(basePath, path, firstItem, options))
            } else {
              fields.push(new FieldTypes(basePath, path, firstItem, options))
            }
          } else {
            fields.push(new FieldSchemas(basePath, path, firstItem, options))
          }

        } else {
          const subFields = this.parseUserSchema(value, path)
          fields.push(...subFields)
        }
      }
    }

    return fields
  }

  validate (data, basePath = []) {
    this.fields.forEach(field =>
      field.validate(data, basePath)
    )
  }

  documentToModel (model, document) {
    this.fields.forEach(field => {
      field.documentToModel(model, document)
    })
    return model
  }

  modelToDocument (model, document) {
    this.fields.forEach(field => {
      field.modelToDocument(model, document)
    })
    return document
  }

  [Symbol.iterator] () {
    return this.fields.values()
  }
}
