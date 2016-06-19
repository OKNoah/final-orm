import ValidationError from "../errors/validation-error"


/** @abstract Field */
export default class Field {


	constructor(basePath = [], path, options = {}, internal = false) {
		this.basePath = basePath
		this.path = path
		this.options = options
		this.internal = internal
	}


	toPrettyPath(subPaths) {
		let props = [].concat(...subPaths)

		let prettyPath = props.map((prop, index)=> {
			if (!/^[A-Za-z$_]+$/.test(prop)) return `[${prop}]`
			if (index === 0) return prop
			return `.${prop}`
		}).join('')

		return prettyPath
	}


	typeError(type, value, subPath = [], basePath = this.basePath) {
		let subPaths = [basePath, this.path, subPath]
		let pathString = this.toPrettyPath(subPaths)
		var valueText = value

		if (Object(value) === value) {
			valueText = value.constructor.name
		} else if (typeof value === 'string') {
			valueText = `'${value}'`
		}

		let message = `Field '${pathString}' must be ${type.name}, but have ${valueText}`
		throw new ValidationError(message)
	}


	throwError(message, subPath = []) {
		throw new ValidationRangeError()
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



