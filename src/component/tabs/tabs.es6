import style from './tabs.styl'


export default class Tabs {

	static selector = 'tabs'
	static styles = [style]

	static template = `
		<div .header>
			<div .titles>
				<content select="tab > tab-title"></content>
			</div> 
			
			<content select="tab-tray"></content>
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


	remove(tab) {
		let index = this.tabs.indexOf(tab)
		if (index !== -1) this.tabs.splice(index, 1)
		this.activateByIndex(index - 1)
	}


	activate(targetTab) {
		let targetIndex = this.tabs.indexOf(targetTab)
		this.activateByIndex(targetIndex)
	}


	activateByIndex(targetIndex) {
		targetIndex = Math.max(targetIndex, 0)
		targetIndex = Math.min(targetIndex, this.tabs.length - 1)

		this.tabs.forEach((tab, index)=> {
			if (index < targetIndex) tab.toPrev()
			else if (index > targetIndex)tab.toNext()
			else tab.toActive()
		})
	}

}



