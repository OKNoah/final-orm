import ComponentPatcher from './component-patcher'


module.exports = class HotLoader {


	static patch(module) {
		if (!module.hot) {
			return
		}

		if (typeof module.exports === 'function') {
			module.exports = this.patchTarget(module.exports, module)
		}

		else {
			for (let key in module.exports) {
				let target = module.exports[key]
				module.exports[key] = this.patchTarget(target, module)
			}
		}
	}


	static patchTarget(target, module) {
		if (ComponentPatcher.test(target)) {
			target = ComponentPatcher.patch(target, module)
		}
		return target
	}

}

