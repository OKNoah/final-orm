import ui from 'ui-js'
import style from './app.styl'
import Audio from '../core/audio'
import server from '../core/server'
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
		<Gallery #gallery></Gallery>
		<Info></Info>
		
		<tabs .content .__blur="gallery.active">
		
			<tab .home-page>
				<tab-title>Рулетка</tab-title>
				<Roulette #roulette></Roulette>
				<Admin-panel [roulette]='roulette'></Admin-panel>
			</tab>
			
			<tab>
				<tab-title>Призы</tab-title>
				Призы
			</tab>
			
			<tab>
				<tab-title>Юзеры</tab-title>
				Юзеры {selector}
			</tab>
			
			<tab>
				<tab-title>Статистика</tab-title>
				Статистика
			</tab>
			
			<tab>
				<tab-title>Настройки</tab-title>
				
				<tabs>
					<tab>
						<tab-title>lol</tab-title>
						lol
					</tab>
					<tab>
						<tab-title>zaz</tab-title>
						zaz
					</tab>
				</tabs>
				
			</tab>
			
		</tabs>
	`

	constructor() {
		this.audio = new Audio()
		this.platform = new Platform()
		this.fontSize = 60
		this.bindHostClasses()
		this.initHandlers()
	}


	initHandlers() {
		this.watch('fontSize', this.updateFonts.bind(this))
		ui.on('resize', this.updateFonts.bind(this))
		this.host.on('init', this.updateFonts.bind(this))
		server.on('error', this.onApiError.bind(this))
	}


	test() {
		this.gallery([
			'http://cs412916.vk.me/v412916031/62f9/rXqGd6jlMgs.jpg',
			'https://pp.vk.me/c623221/v623221137/d268/Q18_Bp-E4XQ.jpg',
			'https://pp.vk.me/c636129/v636129137/b0fd/kH7C504jDyA.jpg',
			'https://pp.vk.me/c623919/v623919137/fa95/2cj7jNNDkbU.jpg',
		])
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



