export default class ValidationError extends TypeError {


	constructor(subPaths, type, value) {
		let pathString = ValidationError.toPrettyPath(subPaths)
		var valueText = value

		if (Object(value) === value) {
			valueText = value.constructor.name
		} else if (typeof value === 'string') {
			valueText = `'${value}'`
		}

		super(`Field '${pathString}' must be ${type.name}, but have ${valueText}`)
		this.name = 'ValidationError'
	}


	static toPrettyPath(subPaths) {
		let props = [].concat(...subPaths)

		let pathString = props.map((prop, index)=> {
			if (typeof prop === 'number') return `[${prop}]`
			if (index === 0) return prop
			return `.${prop}`
		}).join('')

		return pathString
	}


}

