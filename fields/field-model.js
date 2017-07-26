import Field from './field'
import Model from '../models/model'

export default class FieldModel extends Field {
	constructor(basePath, path, Model, options, internal = false) {
		super(basePath, path, options, internal)
		this.Model = Model
		this.symbol = Symbol()
	}

	validate(data, basePath) {
		if (this.internal) return
		if (data instanceof Model) return
		let subModel = this.getByPath(data)

		if (!this.validateValue(subModel)) {
			this.typeError(this.Model, subModel, basePath)
		}
	}

	validateValue(value) {
		return value instanceof this.Model
	}

	documentToModel(model, document) {
		let id = this.getByPath(document)
		this.setBySymbol(model, this.symbol, id)
		this.setAccessorByPath(model)
	}

	modelToDocument(model, document) {
		if (this.internal) return
		if (model instanceof Model) {
			let id = this.getBySymbol(model, this.symbol)
			this.setByPath(document, id)
		}
		else {
			let subModel = this.getByPath(model)
			let id = subModel._id
			this.setByPath(document, id)
		}
	}

	setAccessorByPath(model) {
		let path = this.path.slice()
		let lastProp = path.pop()
		let context = model

		for (let prop of path) {
			if (!context[prop]) context[prop] = {}
			context = context[prop]
		}

		Object.defineProperty(context, lastProp, {
			// enumerable: true,
			configurable: true,
			get: ()=> this.fieldGetter(model),
			set: (value)=> this.fieldSetter(model, value)
		})
	}

	fieldGetter(model) {
		let id = this.getBySymbol(model, this.symbol)
		return this.Model.get(id)
	}

	fieldSetter(model, value) {
		if (!this.validateValue(value)) {
			this.typeError(this.Model, value)
		}
		let id = value._id
		this.setBySymbol(model, this.symbol, id)
	}

	getBySymbol(context, symbol) {
		let path = this.path.slice(0, -1)

		for (let prop of path) {
			context = context[prop]
		}
		return context[symbol]
	}

	setBySymbol(context, symbol, value) {
		let path = this.path.slice(0, -1)

		for (let prop of path) {
			if (!context[prop]) context[prop] = {}
			context = context[prop]
		}

		return context[symbol] = value
	}
}
