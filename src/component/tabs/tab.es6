import style from './tab.styl'


export default class Tab {

	static selector = 'tab'
	static styles = [style]
	static template = `
		<content></content>
	`

	constructor() {
		this.PREV = 1
		this.NEXT = 2
		this.ACTIVE = 3
		this.status = this.NEXT
		this.tabs = this.require('tabs')
		this.bindClass('__prev', 'status is PREV')
		this.bindClass('__next', 'status is NEXT')
		this.bindClass('__active', 'status is ACTIVE')
		this.tabs.add(this)
	}


	toPrev() {
		this.status = this.PREV
	}


	toNext() {
		this.status = this.NEXT
	}


	toActive() {
		this.status = this.ACTIVE
	}


	destructor() {
		this.tabs.remove(this)
	}


	activate() {
		this.tabs.activate(this)
	}

}

