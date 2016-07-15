export default class Tabs {

	static selector = 'tabs'
	static styles = [require('./tabs.styl')]

	static template = `
		<div .titles>
			<content select='tab > tab-title'></content>
		</div>

		<div .content>
			<content></content>
		</div>
	`


	constructor() {
		this.tabs = []
	}


	add(tab) {
		this.tabs.push(tab)
		if (this.tabs.length === 1) {
			this.activateByIndex(0)
		}
	}


	activate(targetTab) {
		let targetIndex = this.tabs.indexOf(targetTab)
		this.activateByIndex(targetIndex)
	}


	activateByIndex(targetIndex) {
		this.tabs.forEach((tab, index)=> {
			if (index < targetIndex) tab.toPrev()
			else if (index > targetIndex)tab.toNext()
			else tab.toActive()
		})
	}

}



