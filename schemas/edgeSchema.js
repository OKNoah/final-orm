import Schema from '../schemas/schema'
import FieldType from '../fields/field-type'

export default class EdgeSchema extends Schema {
  constructor (userSchema, basePath = [], isRootSchema = true) {
    super(userSchema, basePath, isRootSchema)

    if (isRootSchema) {
      this.fields.push(new FieldType(basePath, ['_from'], String, null, true))
      this.fields.push(new FieldType(basePath, ['_to'], String, null, true))
    }
  }
}
