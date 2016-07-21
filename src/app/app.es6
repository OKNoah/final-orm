import AdminPanel from './admin-panel/admin-panel'
import Roulette from './roulette/roulette'
import Platform from 'ui-js/core/platform'
import server from '../core/server'
 import Audio from '../core/audio'
import Info from './info/info'
import style from './app.styl'
import ui from 'ui-js'


export default class App {

	static tag = 'my-app'
	static components = [Info, Roulette, AdminPanel ]

	static style = style
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
				Юзеры
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
		this.platform = new Platform()
		this.audio = new Audio()
		this.fontSize = 60
		this.bindHostClasses()
		this.initHandlers()
	}


	initHandlers() {
		server.on('error', (error)=> this.onApiError(error))
		this.watch('fontSize', ()=> this.updateFonts())
		this.host.on('init', ()=> this.updateFonts())
		ui.on('resize', ()=> this.updateFonts())
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
		this.scope.gallery.open(urls)
	}


	alert(message) {
		this.scope.notificator.alert(message)
	}


	error(message) {
		this.scope.notificator.error(message)
	}


	warning(message) {
		this.scope.notificator.warning(message)
	}


	confirm(text) {
		return this.scope.confirm.confirm(text)
	}


	updateFonts() {
		// let fontSize = this.host.width() / this.fontSize
		// this.host.style.fontSize = `${fontSize}px`
		// this.host.renderStyle()
	}

}

