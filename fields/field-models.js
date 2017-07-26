import FieldModel from './field-model'
import Model from '../models/model'

export default class FieldModels extends FieldModel {
	constructor(basePath, path, Model, options, internal = false) {
		super(basePath, path, Model, options, internal)
		this.arraySymbol = Symbol()
	}

	validate(data, basePath) {
		if (this.internal) return

		if (data instanceof Model) {
			var array = this.getBySymbol(data, this.arraySymbol)
			if (!array) return
		}
		else {
			array = this.getByPath(data)
		}

		this.validateRealArray(array, basePath)
	}

	validateRealArray(array, basePath) {
		if (!Array.isArray(array)) {
			this.typeError(Array, array, basePath)
		}

		array.forEach((value, index) => {
			if (!this.validateValue(value)) {
				this.typeError(this.Model, value, basePath, [index])
			}
		})
	}

	documentToModel(model, document) {
		let arrayIds = this.getByPath(document)
		this.setBySymbol(model, this.symbol, arrayIds)
		this.setAccessorByPath(model)
	}

	modelToDocument(model, document) {
		if (this.internal) return

		if (model instanceof Model) {
			let arrayIds = this.getActualIds(model)
			this.setByPath(document, arrayIds)
		} else {
			let array = this.getByPath(model)
			let arrayIds = array.map(subModel => subModel._id)
			this.setByPath(document, arrayIds)
		}
	}

	getActualIds(model) {
		var realArray = this.getBySymbol(model, this.arraySymbol)
		if (realArray) {
			return realArray.map(subModel => subModel._id)
		}
		else {
			return this.getBySymbol(model, this.symbol)
		}
	}

	setAccessorByPath(model) {
		this.setBySymbol(model, this.arraySymbol, null)
		super.setAccessorByPath(model)
	}

	async fieldGetter(model) {
		let realArray = this.getBySymbol(model, this.arraySymbol)
		if (realArray) return realArray
		let arrayIds = this.getBySymbol(model, this.symbol)
		realArray = this.getRealModels(arrayIds)
		this.setBySymbol(model, this.arraySymbol, realArray)
		return realArray
	}

	async getRealModels(arrayIds) {
		let resultModels = await this.Model.getArr(arrayIds)
		let subModels = {}
		resultModels.forEach(subModel => {
			subModels[subModel._id] = subModel
		})
		return arrayIds.map(id => subModels[id])
	}

	fieldSetter(model, realArray) {
		this.validateRealArray(realArray)
		this.setBySymbol(model, this.arraySymbol, realArray)
	}
}
