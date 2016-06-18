# TODO: Сделать чтобы всплывашка вылезала не залазя за края экрана
# TODO: Нормально настроить еазинг анимаций
# TODO: Прикрепить скроллинг
# TODO: Сделать чтобы если сеттим value то автоматически выбиралась опция которая имеет такой же весью, или пустота
# TODO: Сделать лейбел

module.exports.Select = class Select

	@styles: [require('./select.styl')]
	@selector: 'select'
	@template: "
		<div .wrapper>
			<ul .options [style.transform]='translateY({{-offsetY}}em)'>
				<content></content>
			</ul>
		</div>
	"

	constructor: ->
		@focus = off
		@offsetY = 0
		@options = []
		@value = null
		@activeOption = null
		@bindClass('__focus', 'focus')
		@bind('value', 'activeOption.value')
		@on('click', @toggle)
		@name = @host.attr('name')
		@form = @require('form?')
		@form?.addInput(@)
		return


	destructor: ->
		@form?.removeInput(@)
		return


	reset: ->
		@activate(@options[0])
		return


	addOption: (option)->
		@options.push(option)
		if @options.length is 1
			@activate(option)
		return


	removeOption: (option)->
		index = @options.indexOf(option)
		if index is -1 then return
		@options.splice(index, 1)
		return


	activate: (option)->
		index = @options.indexOf(option)
		@activeOption = option
		@offsetY = index * 2
		return


	toggle: =>
		@focus = !@focus
		return


module.exports.Option = class Option

	@styles: [require('./option.styl')]
	@selector: 'option'
	@template: "
		<content></content> 
	"

	constructor: ->
		@self = @
		@value = null
		@select = @require('select')
		@select.addOption(@)
		@bindClass('__focus', 'select.focus')
		@bindClass('__active', 'self is select.activeOption')
		@initHandlers()
		return


	initHandlers: ->
		@on 'click', => @select.activate(@)
		return


	destructor: ->
		@select.removeOption(@)
		return

