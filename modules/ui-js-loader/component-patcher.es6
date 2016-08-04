import Component from 'ui-js/core/component'


export default class ComponentPatcher {

	static allWrappers = []


	static test(target) {
		if (!target) return false
		return ('selector' in target) || ('template' in target)
	}


	static patch(Class, module) {
		// try {
		if (module.hot.data) {
			var Wrapper = module.hot.data.wrapper
		} else {
			var Wrapper = this.createWrapper(Class.name)
		}

		module.hot.dispose(data => data.wrapper = Wrapper)
		module.hot.accept()

		Wrapper.__setClass(Class)
		// }
		// catch (e) {
		// 	console.error(e)
		// }

		return Wrapper
	}


	static createWrapper(name) {

		// to save original name
		let Wrapper = eval(`(function ${name} () {
			return ${name}.__activeClass.apply(this, arguments) 
		})`)

		this.allWrappers.push(Wrapper)

		Wrapper.__inited = false
		Wrapper.__oldStyle = null
		Wrapper.__oldTemplate = null
		Wrapper.__oldLogic = null
		Wrapper.__activeClass = null
		Wrapper.__oldActiveClass = null
		Wrapper.__oldComponents = null
		Wrapper.__oldTag = null


		Wrapper.toString = function () {
			if (this.__activeClass) {
				return this.__activeClass.toString()
			}
			return ''
		}


		Wrapper.__setClass = function (Class) {
			this.__oldActiveClass = this.__activeClass
			this.__activeClass = Class

			// TODO check directives
			let templateHasDiff = this.__checkTemplate(Class)
			let componentsHasDiff = this.__checkComponents(Class)
			let styleHasDiff = this.__checkStyle(Class)
			let logicHasDiff = this.__checkLogic(Class)
			let tagHasDiff = this.__checkTag(Class)


			let inherits = this.__getInherits()
			this.__copyPropsFrom(Class, inherits)

			if (this.__inited) {

				if (tagHasDiff) {
					throw new Error('Page reload, cuz tag was changed')
				}

				if (logicHasDiff || componentsHasDiff) {
					this.__reload(inherits)
				}
				else {
					if (styleHasDiff) this.__reloadStyle(inherits)
					if (templateHasDiff) this.__reloadTemplate(inherits)
				}

			}

			this.__inited = true
		}


		Wrapper.__reload = function (inherits) {
			this.reload()
			for (let inherit of inherits) inherit.reload()
		}


		Wrapper.__reloadTemplate = function (inherits) {
			this.reloadTemplate()
			for (let inherit of inherits) inherit.reloadTemplate()
		}


		Wrapper.__reloadStyle = function (inherits) {
			this.reloadStyle()
			for (let inherit of inherits) inherit.reloadStyle()
		}


		Wrapper.__getInherits = function (SuperWrapper = this, inherits = []) {
			for (let Wrapper of ComponentPatcher.allWrappers) {
				if (this.__isInherit(Wrapper, SuperWrapper)) {
					if (inherits.indexOf(Wrapper) === -1) {
						inherits.push(Wrapper)
					}
					this.__getInherits(Wrapper, inherits)
				}
			}
			return inherits
		}


		Wrapper.__isInherit = function (Wrapper, SuperWrapper) {
			let prototype = Object.getPrototypeOf(Wrapper.prototype)
			while (prototype) {
				if (prototype.constructor === SuperWrapper) {
					return true
				}
				prototype = Object.getPrototypeOf(prototype)
			}
			return false
		}


		Wrapper.__copyPropsFrom = function (Class, inherits) {
			let oldTemplate = this.template
			let oldPrototype = this.prototype

			let prototype = Object.getPrototypeOf(Class)
			if (Object.setPrototypeOf) Object.setPrototypeOf(this, prototype)
			else this.__proto__ = prototype

			let newProps = Object.getOwnPropertyNames(Class)
			for (let prop of newProps) {
				let descriptor = Object.getOwnPropertyDescriptor(Class, prop)
				Object.defineProperty(this, prop, descriptor)
			}
			this.prototype.constructor = this

			Component.extend(this)

			if (this.__inited) {
				let removedProps = this.__getRemovedProps(newProps)
				for (let removedProp of removedProps) {
					delete this[removedProp]
				}
				this.__copyPropsToInherits(inherits, oldTemplate, oldPrototype)
			}
		}


		Wrapper.__getRemovedProps = function (newProps) {
			let currentProps = Object.getOwnPropertyNames(this.__oldActiveClass)
			return currentProps.filter(prop => newProps.indexOf(prop) === -1)
		}


		Wrapper.__copyPropsToInherits = function (inherits, oldTemplate, oldPrototype) {
			for (let inherit of inherits) {
				// template
				if (inherit.template === oldTemplate) {
					inherit.template = this.template
				}

				// logic
				let context = inherit.prototype
				while (context) {
					let chainPrototype = Object.getPrototypeOf(context)
					if (chainPrototype === oldPrototype) {
						if (Object.setPrototypeOf) {
							Object.setPrototypeOf(context, this.prototype)
						} else {
							context.__proto__ = this.prototype
						}
						break
					}
					context = chainPrototype
				}

			}
		}


		Wrapper.__checkTemplate = function (Class) {
			let template = Class.template + ''
			let hasDiff = this.__oldTemplate !== template
			this.__oldTemplate = template
			return hasDiff
		}


		Wrapper.__checkStyle = function (Class) {
			let style = Class.style + ''
			let hasDiff = this.__oldStyle !== style
			this.__oldStyle = style
			return hasDiff
		}


		Wrapper.__checkLogic = function (Class) {
			let logic = this.__getLogic(Class)
			let hasDiff = this.__oldLogic !== logic
			this.__oldLogic = logic
			return hasDiff
		}


		Wrapper.__checkComponents = function (Class) {
			let components = Class.components || []
			let oldComponents = this.__oldComponents || []
			let hasDiff = this.__componentsHasDiff(components, oldComponents)
			this.__oldComponents = components.slice()
			return hasDiff
		}


		Wrapper.__componentsHasDiff = function (components, oldComponents) {
			if (components.length !== oldComponents.length) {
				return true
			}
			return components.some((component, index)=> {
				return oldComponents[index] !== component
			})
		}


		Wrapper.__checkTag = function (Class) {
			let tag = Class.tag
			let hasDiff = this.__oldTag !== tag
			this.__oldTag = tag
			return hasDiff
		}


		Wrapper.__getLogic = function (Class) {
			let code = ''

			for (let prop of Object.getOwnPropertyNames(Class)) {
				if (prop === 'template' || prop === 'style') continue
				let descriptor = Object.getOwnPropertyDescriptor(Class, prop)
				code += this.__getDescriptorCode(descriptor)
			}

			for (let prop of Object.getOwnPropertyNames(Class.prototype)) {
				let descriptor = Object.getOwnPropertyDescriptor(Class.prototype, prop)
				code += this.__getDescriptorCode(descriptor)
			}

			return code
		}


		Wrapper.__getDescriptorCode = function (descriptor) {
			if (descriptor.hasOwnProperty('value')) {
				let value = descriptor.value

				if (typeof value === 'function') {
					return '' + descriptor.value
				}
				else {
					return JSON.stringify(value)
				}
			}

			return '' + descriptor.get + descriptor.set
		}


		return Wrapper


	}

}





