import ValidationError from "../errors/validation-error"

/** @abstract class */
export default class Field {
  constructor (basePath = [], path, options = {}, internal = false) {
    if (!internal) this.checkPath(path, basePath)
    this.options = this.normalizeOptions(options)
    this.basePath = basePath
    this.internal = internal
    this.path = path
  }

  isOptional (value) {
    return (!value) && this.options.optional
  }

  normalizeOptions (options) {
    const normalOptions = {}
    for (const key in options) if (options.hasOwnProperty(key)) {
      const value = options[key]
      const normalKey = key.match(/^\$?(.*)/)[1]
      normalOptions[normalKey] = value
    }

    if (normalOptions.unique) {
      normalOptions.index = true
    }

    return normalOptions
  }

  checkPath(path, basePath) {
    for (const prop of path) {
      const match = prop.match(/^([_$])/)
      if (match) {
        const stringPath = this.pathsToString([basePath, path])
        throw Error(`Field names can not begin with a '${match[1]}' symbol, but have '${stringPath}'`)
      }
    }
  }

  pathsToString(subPaths) {
    const props = [].concat(...subPaths)

    const prettyPath = props.map((prop, index)=> {
      if (!/^[A-Za-z$_]+$/.test(prop)) return `[${prop}]`
      if (index === 0) return prop
      return `.${prop}`
    }).join('')

    return prettyPath
  }

  valueToString(value) {
    if (Object(value) === value) return value.constructor.name
    if (typeof value === 'string') return `'${value}'`
    return value
  }

  typeError(type, value, basePath, subPath) {
    var valueText = this.valueToString(value)
    const message = `must be ${type.name}, but have ${valueText}`
    this.throwError(message, basePath, subPath)
  }

  throwError(message, basePath = this.basePath, subPath = []) {
    const subPaths = [basePath, this.path, subPath]
    const pathString = this.pathsToString(subPaths)
    throw new ValidationError(`Field '${pathString}' ${message}`)
  }

  documentToModel(model, document) {
    let value = this.getByPath(document)
    value = this.convertToModelValue(value)
    this.setByPath(model, value)
  }

  modelToDocument(mode, document) {
    let value = this.getByPath(mode)
    value = this.convertToDocumentValue(value)
    this.setByPath(document, value)
  }

  validate() {
    throw 'validate is just virtual method'
  }

  convertToModelValue() {
    throw 'convertToModelValue is just virtual method'
  }

  convertToDocumentValue() {
    throw 'convertToDocumentValue is just virtual method'
  }

  getByPath(context) {
    for (const prop of this.path) {
      context = context[prop]
    }
    return context
  }

  setByPath(context, value) {
    const path = this.path.slice()
    const lastProp = path.pop()

    for (const prop of path) {
      if (!context[prop]) context[prop] = {}
      context = context[prop]
    }

    return context[lastProp] = value
  }
}
