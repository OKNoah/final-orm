import Schema from '../schema'
import Field from './field'

export default class FieldSchemas extends Field {
  constructor (basePath, path, userSchema, options, internal) {
    super(basePath, path, options, internal)
    this.schema = new Schema(userSchema, [...basePath, ...path, '..'], false)
  }

  validate (data, basePath) {
    if (this.internal) return
    const array = this.getByPath(data)

    if (!Array.isArray(array)) {
      this.typeError(Array, array, basePath)
    }

    array.forEach((value, index) => {
      if (value !== Object(value)) this.typeError(Object, value, basePath, [index])
      const subPath = [...basePath, ...this.path, index]
      this.schema.validate(value, subPath)
    })
  }

  convertToModelValue(array) {
    return array.map(document => {
      const model = {}
      return this.schema.documentToModel(model, document)
    })
  }

  convertToDocumentValue(array) {
    return array.map(model => {
      const document = {}
      return this.schema.modelToDocument(model, document)
    })
  }
}
