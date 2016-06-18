module.exports.test = (target)->
	return target.selector and target.template 


module.exports.patch = (target, module)->
	Wrapper = module.hot.data?.component or createWrapper(target)
	Wrapper.__updateComponent(target)
	module.hot.dispose (data)-> data.component = Wrapper
	module.hot.accept()
	#ui.update()
	return Wrapper


createWrapper = (target)->
	CurrentComponent = null
	OldComponent = null


	Wrapper = eval("(function #{target.name}(){
		return CurrentComponent.apply(this, arguments)
	})")


#	Wrapper.toString = ->
#		return CurrentComponent.toString()


	Wrapper.__updateComponent = (NewComponent)->
		try
			unless CurrentComponent
				CurrentComponent = NewComponent
				copyProps(Wrapper, CurrentComponent)
				return

			OldComponent = CurrentComponent
			CurrentComponent = NewComponent

			clearProps(Wrapper, OldComponent)
			copyProps(Wrapper, CurrentComponent)

			if logicChange(OldComponent, CurrentComponent)
				Wrapper.reload()
				return

			if propChange('style', OldComponent, CurrentComponent)
				Wrapper.reloadStyle()

			templateChange = propChange('template', OldComponent, CurrentComponent)
			componentsChange = propChange('components', OldComponent, CurrentComponent)
			if templateChange or componentsChange
				Wrapper.reloadTemplate()

		catch error
			console.error error
		return

	return Wrapper


clearProps = (Wrapper, OldComponent)->
	for key, value of OldComponent.prototype
		delete Wrapper.prototype[key]

	for key, value of OldComponent
		delete Wrapper[key]
	return


copyProps = (Wrapper, CurrentComponent)->
	for key, value of CurrentComponent.prototype
		Wrapper.prototype[key] = value

	Wrapper.prototype.constructor = Wrapper

	for key, value of CurrentComponent
		Wrapper[key] = value
	return


propChange = (prop, OldComponent, CurrentComponent)->
	return OldComponent[prop] + '' isnt CurrentComponent[prop] + ''


logicChange = (OldComponent, CurrentComponent)->
	except = ['style', 'template', 'components']

	oldKeys = Object.getOwnPropertyNames(OldComponent)
	keys = Object.getOwnPropertyNames(CurrentComponent)
	oldKeys = keys.filter (key)-> not (key in except)
	keys = keys.filter (key)-> not (key in except)

	if keys.length isnt oldKeys.length then return true
	for key in keys
		value = CurrentComponent[key] + ''
		oldValue = OldComponent[key] + ''
		if value isnt oldValue then return true

	oldKeys = Object.getOwnPropertyNames(OldComponent.prototype)
	keys = Object.getOwnPropertyNames(CurrentComponent.prototype)

	if oldKeys.length isnt keys.length then return true
	for key in keys
		value = CurrentComponent.prototype[key] + ''
		oldValue = OldComponent.prototype[key] + ''
		if value isnt oldValue then return true

	return false


