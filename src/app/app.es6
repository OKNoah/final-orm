import ui from 'ui-js'
import style from './app.styl'
import server from '../core/server'
import Promise from 'ui-js/core/promise'
import Platform from 'ui-js/core/platform'
import AdminPanel from './admin-panel/admin-panel'
import Roulette from './roulette/roulette'
import Info from './info/info'


export default class App {

	static selector = 'my-app'
	static styles = [style]
	static components = [Info, Roulette, AdminPanel]

	static template = `
		<Confirm #confirm></Confirm>
		<Notificator #notificator></Notificator>
		<Info></Info>
		
		<div .content>
			<Roulette #roulette></Roulette>
			<Admin-panel [roulette]='roulette'></Admin-panel>
		</div>
	`

	static template = `
		<Confirm #confirm></Confirm>
		<Notificator #notificator></Notificator>
		<Info></Info>
		
		<tabs .content>
		
			<tab .home-page>
				<tab-title>Главная</tab-title>
				<Roulette #roulette></Roulette>
				<Admin-panel [roulette]='roulette'></Admin-panel>
			</tab>
			
			<tab>
				<tab-title>Настройки</tab-title>
				Settings
			</tab>
			
			<tab .settings-page>
				<tab-title>Статистика</tab-title>
				<Admin-panel [roulette]='roulette'></Admin-panel>
			</tab>
			
		</tabs>
	`

	constructor() {
		this.audioContext = new AudioContext()
		this.soundBuffersLoadPromises = {}

		this.platform = new Platform()
		this.fontSize = 70
		this.bindHostClasses()
		this.initHandlers()
	}


	initHandlers() {
		this.watch('fontSize', this.updateFonts.bind(this))
		ui.on('resize', this.updateFonts.bind(this))
		this.host.on('init', this.updateFonts.bind(this))
		server.on('error', this.onApiError.bind(this))
	}


	onApiError(error) {
		this.error(error.message)
	}


	bindHostClasses() {
		this.bindClass('__ms', 'platform.ms')
		this.bindClass('__ie', 'platform.ie')
		this.bindClass('__edge', 'platform.edge')
		this.bindClass('__chrome', 'platform.chrome')
		this.bindClass('__firefox', 'platform.firefox')
	}


	playSound(url, volume = 1) {
		this.loadSound(url).then((buffer)=>
			this.playSoundBuffer(buffer, volume)
		)
	}


	playSoundBuffer(buffer, volume) {
		let gainNode = this.audioContext.createGain()
		gainNode.gain.value = volume
		let source = this.audioContext.createBufferSource()
		source.buffer = buffer
		source.connect(gainNode)
		gainNode.connect(this.audioContext.destination)
		source.start(0)
	}


	loadSound(url) {
		if (this.soundBuffersLoadPromises[url]) {
			return this.soundBuffersLoadPromises[url]
		}

		let promise = new Promise()
		let request = new XMLHttpRequest()
		request.open('GET', url, true)
		request.responseType = 'arraybuffer'

		request.addEventListener('load', ()=> {
			let audioData = request.response
			this.audioContext.decodeAudioData(audioData, promise.resolve, promise.reject)
		})

		request.send()
		this.soundBuffersLoadPromises[url] = promise
		return promise
	}


	gallery(urls) {
		this.locals.gallery.open(urls)
	}


	alert(message) {
		this.locals.notificator.alert(message)
	}


	error(message) {
		this.locals.notificator.error(message)
	}


	warning(message) {
		this.locals.notificator.warning(message)
	}


	confirm(text) {
		return this.locals.confirm.confirm(text)
	}


	updateFonts() {
		// let fontSize = this.host.width() / this.fontSize
		// this.host.style.fontSize = `${fontSize}px`
		// this.host.renderStyle()
	}

}



