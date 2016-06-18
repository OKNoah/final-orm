export default class Field {


	constructor(path, internal = false) {
		this.path = path
		this.internal = internal
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



