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
			static __prevStyles = null
			static __prevTemplate = null
			static __prevLogic = null
			static __activeClass = null


			static __setClass(Class) {
				this.__activeClass = Class

				let changedTemplate = this.__checkTemplate(Class)
				let changedStyles = this.__checkStyles(Class)
				let changedLogic = this.__checkLogic(Class)

				this.__copyProps(Class)

				if (this.__inited) {
					let inherits = this.__getInherits()
					this.__updateStylesInInherits(inherits)

					if (changedLogic) this.__reload(inherits) // full reload
					else {
						if (changedStyles) this.__reloadStyles(inherits)
						if (changedTemplate) this.__reloadTemplate(inherits)
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


			static __copyProps(Class) {
				let prototype = Object.getPrototypeOf(Class)

				if (Object.setPrototypeOf) Object.setPrototypeOf(this, prototype)
				else this.__proto__ = prototype


				for (let prop of Object.getOwnPropertyNames(Class)) {
					let descriptor = Object.getOwnPropertyDescriptor(Class, prop)
					Object.defineProperty(this, prop, descriptor)
				}

				this.prototype.constructor = this

				Component.extend(Class)
			}


			static __updateStylesInInherits(inherits) {
				console.dir(inherits)
			}


			static __checkTemplate(Class) {
				let changedTemplate = this.__prevTemplate != Class.template + ''
				this.__prevTemplate = Class.template + ''
				return changedTemplate
			}


			static __checkStyles(Class) {
				let changedStyles = this.__prevStyles != Class.styles + ''
				this.__prevStyles = Class.styles + ''
				return changedStyles
			}


			static __checkLogic(Class) {
				let logic = this.__getLogic(Class)
				let changedLogic = this.__prevLogic != logic
				this.__prevLogic = logic
				return changedLogic
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





