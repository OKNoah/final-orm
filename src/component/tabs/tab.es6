export default class Tab {

	static selector = 'tab'
	static styles = [require('./tab.styl')]
	static template = `
		<content></content>
	`

	PREV = 1
	NEXT = 2
	ACTIVE = 3


	constructor() {
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

