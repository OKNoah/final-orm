import arangojs, { aql } from 'arangojs'
import Schema from '../schemas/schema'
import { pick } from 'lodash'

export default class Model {
  static options = null // connection options
  static schema = null // user schema

  static _normalSchema = null
  static _collection = null
  static _database = null
  static aql = aql

  static _getSchema () {
    if (!this._normalSchema) {
      this._normalSchema = new Schema(this.schema)
    }
    return this._normalSchema
  }

  static async _getDatabase () {
    if (Model._database) {
      return Model._database
    }

    const dbName = this.options.database
    const host = this.options.host || 'localhost'
    const port = this.options.port || 8529
    const username = this.options.username || 'root'
    const password = this.options.password || ''
    const url = this.options.url || `http://${username}:${password}@${host}:${port}`

    const db = arangojs({
      url
    })

    try {
      await db.createDatabase(dbName)
    } catch (e) {
    }

    db.useDatabase(dbName)

    Model._database = db
    return db
  }

  static async _getCollection () {
    if (this._collection) {
      return this._collection
    }

    const db = await this._getDatabase()
    const collection = db.collection(this.name)
    try {
      await collection.create()
      await this._setIndexes(collection)
    } catch (e) {
    }
    return this._collection = collection
  }

  static async _setIndexes (collection) {
    const schema = this._getSchema()
    for (const field of schema) {
      if (!field.options.index) continue

      const path = field.path.join('.')
      const unique = field.options.unique
      await collection.createHashIndex(path, {unique})
    }
  }

  static async _call (method, ...args) {
    try {
      const collection = await this._getCollection()
      if (!collection[method]) {
        throw Error(`Collection has no method '${method}'`)
      }

      return await collection[method](...args)
    } catch (error) {
      console.error(error)
    }
  }

  static _validate (data) {
    const schema = this._getSchema()
    schema.validate(data)
  }

  static _getDocument (documentHandle) {
    return this._call('document', documentHandle)
  }

  static _getDocuments (documentHandles) {
    return this._call('lookupByKeys', documentHandles)
  }

  static _createModelByDocument (document) {
    const model = Object.create(this.prototype)
    this._documentToModel(model, document)
    model.constructor()
    return model
  }

  static _documentToModel (model, document) {
    const schema = this._getSchema()
    schema.documentToModel(model, document)
    return model
  }

  static _modelToDocument (model) {
    const schema = this._getSchema()
    const document = {}
    schema.modelToDocument(model, document)
    return document
  }

  /******************* public static methods *******************/
  static async add (data) {
    this._validate(data)
    data = this._modelToDocument(data)
    data._removed = false
    data.createdAt = new Date().toISOString()
    const documentHandle = await this._call('save', data)
    const document = await this._call('document', documentHandle)
    return this._createModelByDocument(document)
  }

  static async get (documentHandle) {
    const document = await this._getDocument(documentHandle)
    return this._createModelByDocument(document)
  }

  static async getArr (documentHandles) {
    const documents = await this._getDocuments(documentHandles)
    return documents.map(document => {
      return this._createModelByDocument(document)
    })
  }

  static async save (model) {
    this._validate(model)
    const document = this._modelToDocument(model)
    document.updateddAt = new Date().toISOString()
    const newHandle = await this._call('update', model._id, document)
    model._rev = newHandle._rev
    return model
  }

  static async update (model) {
    const document = await this._getDocument(model)
    this._documentToModel(model, document)
    return model
  }

  static async remove (model) {
    model._removed = true
    return this.save(model)
  }

  static async restore (model) {
    model._removed = false
    return this.save(model)
  }

  static async find (args) {
    const db = await this._getDatabase()
    const { skip, limit, where, attributes } = args
    const item = this.name.toLowerCase()
    let query = `for ${item} in ${this.name}`
    if (where) {
      for (const key in where) {
        query += ` filter ${item}.${key} == "${where[key]}"`
      }
    }
    if (limit || skip) {
      query += ` limit ${skip ? skip + ', ' : ''}${limit || 100}`
    }
    if (attributes) {
      query += ` return {`
      attributes.map((attribute, index) => {
        query += `${attribute}: ${item}.${attribute}${index + 1 !== attributes.length && ', '} `
      })
      query += `}`
    } else {
      query += ` return ${item}`
    }
    const cursor = await db.query(query)
    const documents = await cursor.all()
    return documents.map((doc) => {
      return this._createModelByDocument(doc)
    })
  }

  static async findOne (args) {
    args.skip = 0
    args.limit = 1
    const models = await this.find(args)
    const model = models[0]
    return model || null
  }

  static async count (selector) {
    const cursor = await this._call('byExample', selector)
    return cursor.count
  }

  static async have (selector) {
    const model = await this.findOne(selector)
    return !!model
  }

  /******************* public methods *******************/
  async save () {
    return this.constructor.save(this)
  }

  async update () {
    return this.constructor.update(this)
  }

  async remove () {
    return this.constructor.remove(this)
  }

  async restore () {
    return this.constructor.restore(this)
  }
}
