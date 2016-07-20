// TODO: Сделать чтобы всплывашка вылезала не залазя за края экрана
// TODO: Нормально настроить еазинг анимаций
// TODO: Прикрепить скроллинг
// TODO: Сделать чтобы если сеттим value то автоматически выбиралась опция которая имеет такой же весью, или пустота
// TODO: Сделать лейбел

export default class Select {

	static style = require('./select.styl')
	static selector = 'select'

	static template = `
		<div .wrapper>
			<ul .options [style.transform]='translateY({{-offsetY}}em)'>
				<content></content>
			</ul>
		</div>
	`

	constructor() {
		this.focus = false
		this.offsetY = 0
		this.options = []
		this.value = null
		this.activeOption = null
		this.bindClass('__focus', 'focus')
		this.bind('value', 'activeOption.value')
		this.on('click', this.toggle)
		this.name = this.host.attr('name')
		this.form = this.require('form?')
		if (this.form) {
			this.form.addInput(this)
		}
	}


	destructor() {
		if (this.form) {
			this.form.removeInput(this)
		}
	}


	reset() {
		this.activate(this.options[0])
	}


	addOption(option) {
		this.options.push(option)
		if (this.options.length === 1) {
			this.activate(option)
		}
	}


	removeOption(option) {
		let index = this.options.indexOf(option)
		if (index == -1) return
		this.options.splice(index, 1)
	}


	activate(option) {
		let index = this.options.indexOf(option)
		this.activeOption = option
		this.offsetY = index * 2
	}


	toggle() {
		this.focus = !this.focus
	}

}




