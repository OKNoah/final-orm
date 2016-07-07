import ValidationError from "../errors/validation-error"


/** @abstract class */
export default class Field {


	constructor(basePath = [], path, options = {}, internal = false) {
		if (!internal) this.checkPath(path, basePath)
		this.options = this.normalizeOptions(options)
		this.basePath = basePath
		this.internal = internal
		this.path = path
	}


	isOptional(value) {
		return (value == null) && this.options.optional
	}


	normalizeOptions(options) {
		let normalOptions = {}
		for (let key in options) if (options.hasOwnProperty(key)) {
			let value = options[key]
			let normalKey = key.match(/^\$?(.*)/)[1]
			normalOptions[normalKey] = value
		}

		if (normalOptions.unique) {
			normalOptions.index = true
		}

		return normalOptions
	}


	checkPath(path, basePath) {
		for (let prop of path) {
			let match = prop.match(/^([_$])/)
			if (match) {
				let stringPath = this.pathsToString([basePath, path])
				throw Error(`Field names can not begin with a '${match[1]}' symbol, but have '${stringPath}'`)
			}
		}
	}


	pathsToString(subPaths) {
		let props = [].concat(...subPaths)

		let prettyPath = props.map((prop, index)=> {
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
		let message = `must be ${type.name}, but have ${valueText}`
		this.throwError(message, basePath, subPath)
	}


	throwError(message, basePath = this.basePath, subPath = []) {
		let subPaths = [basePath, this.path, subPath]
		let pathString = this.pathsToString(subPaths)
		throw new ValidationError(`Field '${pathString}' ${message}`)
	}


	documentToModel(model, document) {
		let value = this.getByPath(document)
		value = this.convertToModelValue(value)
		this.setByPath(model, value)
	}


	modelToDocument(mode, document) {
		if (this.internal) return
		let value = this.getByPath(mode)
		value = this.convertToDocumentValue(value)
		this.setByPath(document, value)
	}


	validate(data) {
		throw 'validate is just virtual method'
	}


	convertToModelValue(value) {
		throw 'convertToModelValue is just virtual method'
	}


	convertToDocumentValue(value) {
		throw 'convertToDocumentValue is just virtual method'
	}


	getByPath(context) {
		for (let prop of this.path) {
			context = context[prop]
		}
		return context
	}


	setByPath(context, value) {
		let path = this.path.slice()
		let lastProp = path.pop()

		for (let prop of path) {
			if (!context[prop]) context[prop] = {}
			context = context[prop]
		}

		return context[lastProp] = value
	}

}



