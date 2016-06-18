ComponentPatcher = require('./component-patcher')


module.exports = new class HotLoader 


	patch: (module)->
		unless module.hot then return

		defaultMode = 'default' of module.exports
		target = module.exports

		if ComponentPatcher.test(target)
			target = ComponentPatcher.patch(target, module)

		module.exports = target
		return



