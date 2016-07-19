import style from './admin-panel.styl'
import Sector from '../../api/sector'


export default class AdminPanel {

	static selector = 'admin-panel'
	static styles = [style]
	static template = `

		<modal #loginForm> 
			<form (submit)="User.login(this)">
				<text name="login">login</text>
				<text name="pass">pass</text>
				<submit>Войти</submit>
			</form> 
		</modal>

		<div .controls>
			<form (submit)="addSector(this)">
				<file name="bg">Фон</file>
				<file name="contentBg">Фон контента</file>
				<text name="name">Имя</text>
				<submit>Добавить сектор</submit>
			</form>
			
			<button (click)="User.logout()" *else="User.current">
			  Выйти
			</button>
			
			<button (click)="#loginForm.open()" *if="!User.current">
				Войти
			</button>
			
			{{ User.current.name }}
		</div>


		<ul .sectors>
			<li .sector *for="sector in sectors" .__selected="selectedSector is sector">
					
				<div .sector-content (click)="selectSector(sector)"
					 [style.backgroundImage]="url(/storage/{{sector.bg}})">
						{{ sector }}
				</div>

				<div .sector-controls>
					<div .remove (click)="sector.remove()">X</div>
				</div>
			</li> 
		</ul>
	`


	constructor() {
		this.sectors = Sector.list()
		// this.roulette = null
		this.selectedSector = null
		this.initHandlers()
	}

	test(){
		console.log('test!!')
	}


	initHandlers() {
		this.on('init', ()=> {
			// this.roulette.on('sectorclick', this.selectSector)
		})

		this.sectors.on('update', ()=> {
			// console.log('sectors update')
		})
	}


	selectSector(sector) {
		this.selectedSector = sector
		this.roulette.rotateToSector(sector)
	}


	addSector(form) {
		form.has('bg', 'Не выбран фон')
		form.has('contentBg', 'Не фон контента')
		Sector.add(form)
	}


}

