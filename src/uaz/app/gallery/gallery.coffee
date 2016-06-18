Photo = require('./photo/photo')
Popup = require('../../component/popup/popup')


module.exports = class Gallery extends Popup

	@styles: Popup.styles.concat [require('./gallery.styl')]
	@components: [Photo]
	@selector: 'gallery'
	@template: "

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
	"

	constructor: ->
		super
		@slides = [{type: 'photo', src: 'http://fonday.ru/images/tmp/12/2/original/12248OmMZeshtoaDCnIYA.jpg'}]

		@morOne = no
		@previewsX = 0
		@activeSlide = null
		@activateByIndex(0)
		return


	open: (urls = [])->
		super
		@slides = urls.map (url)-> {type: 'photo', src: url}
		@morOne = @slides.length > 1
		@activateByIndex(0)
		return


	initHandlers: ->
		super
		ui.keyboard.on 'left', => @prev()
		ui.keyboard.on 'right', => @next()
		return


	onPanelWheel: (event)->
		if event.realEvent.deltaY > 0 then @next()
		else @prev()
		return


	next: ->
		index = @slides.indexOf(@activeSlide)
		@activateByIndex(index + 1)
		return


	prev: ->
		index = @slides.indexOf(@activeSlide)
		@activateByIndex(index - 1)
		return


	activateByIndex: (index)->
		index = Math.max(Math.min(index, @slides.length - 1), 0)
		@activeSlide = @slides[index]
		@reset()
		@previewsX = index * 3.2
		return


	reset: ->
		@locals.photo?.reset()
		return


	exit: ->
		super
		@reset()
		return

