export default class Pagination {

	static styles = [require('./pagination.styl')]
	static selector = 'pagination'

	static template = `
		<ul *if='moreThenOne(pagesCount)'>
			<li *for='pageNumber in pagesCount'
				.page-number .__active='pageNumber is activePageIndex'
				(click)='activatePage(pageNumber)'>
				{{ pageNumber + 1 }}
			</li>
		</ul>
	`

	constructor() {
		this.list = null
		this.limit = 5
		this.pagesCount = 0
		this.activePageIndex = 0

		this.watch('list.count', this.onListCountChange)
		this.watch('list.limit', this.onListLimitChange)
		ui.bind(this, 'limit', this, 'list.limit')
	}


	moreThenOne(pagesCount) {
		return pagesCount > 1
	}


	updatePagesCount() {
		let delta = this.list.count / this.list.limit
		let result = Math.ceil(delta)
		if (Number.isFinite(result)) this.pagesCount = result
		else this.pagesCount = 0

		if (this.pagesCount === 0) {
			this.activatePage(0)
		}
		else if (this.activePageIndex > this.pagesCount - 1) {
			this.activatePage(this.pagesCount - 1)
		}
	}


	onListCountChange() {
		this.updatePagesCount()
	}


	onListLimitChange(limit) {
		this.list.skip = this.activePageIndex * limit
		this.updatePagesCount()
	}


	activatePage(activePageIndex) {
		this.activePageIndex = activePageIndex
		this.list.skip = this.activePageIndex * this.list.limit
	}

}






