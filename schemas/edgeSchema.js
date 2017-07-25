import Model from '../models/model'
import FieldType from '../fields/field-type'
import FieldTypes from '../fields/field-types'
import FieldModel from '../fields/field-model'
import FieldModels from '../fields/field-models'
import FieldSchemas from '../fields/field-schemas'

export default class Schema {
  constructor (userSchema, basePath = [], isRootSchema = true) {
    this.basePath = basePath
    this.fields = this.parseUserSchema(userSchema)

    if (isRootSchema) {
      this.fields.push(new FieldType(basePath, ['_from'], String, null, true))
      this.fields.push(new FieldType(basePath, ['_to'], String, null, true))
      this.fields.push(new FieldType(basePath, ['_id'], String, null, true))
      this.fields.push(new FieldType(basePath, ['_key'], String, null, true))
      this.fields.push(new FieldType(basePath, ['_rev'], String, null, true))
      this.fields.push(new FieldType(basePath, ['_removed'], Boolean, null, true))
    }
  }
}
