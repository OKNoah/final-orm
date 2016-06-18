import Photo from './photo/photo'
import Popup from '../../component/popup/popup'


export default class Gallery extends Popup {

	static styles = Popup.styles.concat [require('./gallery.styl')]
	static components = [Photo]
	static selector = 'gallery'
	static template = `

		<div .wrapper #wrapper ((click))='exit()'>
			<div .content #content>
				<div .scale #scale>
					<div .slide>

						<photo .photo #photo
						[state]='state'
						[wrapper]='wrapper'
						[src]='activeSlide.src'
						(exit)='exit()'>
						</photo>

					</div>
				</div>
			</div>
		</div>

		<div *if='morOne' .panel (wheel)='onPanelWheel($event)'>
			<ul .previews [style.transform]='translateX({{ -previewsX }}em)'>

				<li .preview
					*for='slide, index in slides'
					[style.backgroundImage]='url({{ slide.src }})'
					(click)='activateByIndex(index)'>
				</li>

			</ul>
		</div>
	`

	constructor() {
		super()
		this.slides = [{type: 'photo', src: 'http://fonday.ru/images/tmp/12/2/original/12248OmMZeshtoaDCnIYA.jpg'}]

		this.morOne = no
		this.previewsX = 0
		this.activeSlide = null
		this.activateByIndex(0)
	}


	open(urls = []) {
		super.open()
		this.slides = urls.map((url)=>({type: 'photo', src: url}))
		this.morOne = this.slides.length > 1
		this.activateByIndex(0)
	}


	initHandlers() {
		super.initHandlers()
		ui.keyboard.on('left', ()=> this.prev())
		ui.keyboard.on('right', ()=> this.next())
	}


	onPanelWheel(event) {
		if (event.realEvent.deltaY > 0) this.next()
		else this.prev()
	}


	next() {
		let index = this.slides.indexOf(this.activeSlide)
		this.activateByIndex(index + 1)
	}


	prev() {
		let index = this.slides.indexOf(this.activeSlide)
		this.activateByIndex(index - 1)
	}


	activateByIndex(index) {
		index = Math.max(Math.min(index, this.slides.length - 1), 0)
		this.activeSlide = this.slides[index]
		this.reset()
		this.previewsX = index * 3.2
	}


	reset() {
		if (this.locals.photo) {
			this.locals.photo.reset()
		}
	}


	exit() {
		super.exit()
		this.reset()
	}

}


