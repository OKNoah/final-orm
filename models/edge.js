import Model from './model'
import EdgeSchema from '../schemas/edgeSchema'

export default class Edge extends Model {
  static _normalSchema = null
  static _collection = null

  static _getSchema () {
    if (!this._normalSchema) {
      this._normalSchema = new EdgeSchema(this.schema)
    }
    return this._normalSchema
  }

  static _getDocument (documentHandle) {
    return this._call('edge', documentHandle)
  }

  static async _getCollection () {
    if (this._collection) {
      return this._collection
    }

    const db = await this._getDatabase()
    const edge = db.edgeCollection(this.name)
    try {
      await edge.create()
      await this._setIndexes(edge)
    } catch (e) {
    }

    return this._collection = edge
  }

  static async add (from, to, data = {}) {
    this._validate(data)
    data = this._modelToDocument(data)
    data._removed = false
    data.createdAt = new Date().toISOString()
    data._from = typeof from === 'object' ? from._id : from
    data._to = typeof to === 'object' ? to._id : to
    const documentHandle = await this._call('save', data)
    const document = await this._call('edge', documentHandle)
    return this._createModelByDocument(document)
  }
}
