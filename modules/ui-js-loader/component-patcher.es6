import Component from 'ui-js/core/component'


export default class ComponentPatcher {

	static allWrappers = []


	static test(target) {
		if (!target) return false
		return ('selector' in target) || ('template' in target)
	}


	static patch(Class, module) {
		try {

			if (module.hot.data) {
				var Wrapper = module.hot.data.wrapper
			} else {
				var Wrapper = this.createWrapper()
			}

			module.hot.dispose(data => data.wrapper = Wrapper)
			module.hot.accept()

			Wrapper.__setClass(Class)
		}
		catch (e) {
			console.error(e)
		}

		return Wrapper
	}


	static createWrapper() {
		var Wrapper = this.createWrapperClass()
		this.allWrappers.push(Wrapper)
		return Wrapper
	}


	static createWrapperClass() {


		return class Wrapper {

			constructor() {
				return Wrapper.__activeClass.apply(this, arguments)
			}

			static __inited = false
			static __oldStyles = null
			static __oldTemplate = null
			static __oldLogic = null
			static __activeClass = null


			static __setClass(Class) {
				this.__activeClass = Class

				let templateHasDiff = this.__checkTemplate(Class)
				let stylesHasDiff = this.__checkStyles(Class)
				let logicHasDiff = this.__checkLogic(Class)

				let inherits = this.__getInherits()
				this.__copyPropsFrom(Class, inherits)

				if (this.__inited) {
					if (logicHasDiff) {
						this.__reload(inherits)
					}
					else {
						if (stylesHasDiff) this.__reloadStyles(inherits)
						if (templateHasDiff) this.__reloadTemplate(inherits)
					}

				}

				this.__inited = true
			}


			static __reload(inherits) {
				this.reload()
				// console.log('reload logic inherits', inherits)
				for (let inherit of inherits) inherit.reload()
			}


			static __reloadTemplate(inherits) {
				this.reloadTemplate()
				// console.log('reload template inherits', inherits)
				for (let inherit of inherits) inherit.reloadTemplate()
			}


			static __reloadStyles(inherits) {
				this.reloadStyles()
				// console.log('reload styles inherits', inherits)
				for (let inherit of inherits) inherit.reloadStyles()
			}


			static __getInherits(SuperWrapper = this, inherits = []) {
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


			static __isInherit(Wrapper, SuperWrapper) {
				let prototype = Object.getPrototypeOf(Wrapper.prototype)
				while (prototype) {
					if (prototype.constructor === SuperWrapper) {
						return true
					}
					prototype = Object.getPrototypeOf(prototype)
				}
				return false
			}


			static __copyPropsFrom(Class, inherits) {
				let oldTemplate = this.template
				let oldPrototype = this.prototype

				let prototype = Object.getPrototypeOf(Class)
				if (Object.setPrototypeOf) Object.setPrototypeOf(this, prototype)
				else this.__proto__ = prototype

				// TODO remove deleted props
				for (let prop of Object.getOwnPropertyNames(Class)) {
					let descriptor = Object.getOwnPropertyDescriptor(Class, prop)
					Object.defineProperty(this, prop, descriptor)
				}
				this.prototype.constructor = this

				Component.extend(this)

				if (this.__inited) {
					this.__copyPropsToInherits(inherits, oldTemplate, oldPrototype)
				}
			}


			static __copyPropsToInherits(inherits, oldTemplate, oldPrototype) {
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


			static __checkTemplate(Class) {
				let template = Class.template + ''
				let hasDiff = this.__oldTemplate !== template
				this.__oldTemplate = template
				return hasDiff
			}


			static __checkStyles(Class) {
				let styles = Class.styles + ''
				let hasDiff = this.__oldStyles !== styles
				this.__oldStyles = styles
				return hasDiff
			}


			static __checkLogic(Class) {
				let logic = this.__getLogic(Class)
				let hasDiff = this.__oldLogic !== logic
				this.__oldLogic = logic
				return hasDiff
			}


			static __getLogic(Class) {
				let code = ''

				for (let prop of Object.getOwnPropertyNames(Class)) {
					if (prop === 'template' || prop === 'styles') continue
					let descriptor = Object.getOwnPropertyDescriptor(Class, prop)
					code += this.__getDescriptorCode(descriptor)
				}

				for (let prop of Object.getOwnPropertyNames(Class.prototype)) {
					let descriptor = Object.getOwnPropertyDescriptor(Class.prototype, prop)
					code += this.__getDescriptorCode(descriptor)
				}

				return code
			}


			static __getDescriptorCode(descriptor) {
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


		}

	}

}





