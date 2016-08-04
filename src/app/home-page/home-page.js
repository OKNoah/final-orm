import Roulette from './roulette/roulette'
import style from './home-page.styl'
import wood from './wood.jpg'
import SectorApi from '../../api/sector-api'


export default class HomePage {

	static tag = 'home-page'
	static style = style
	static components = [Roulette]
	static template = `
		<Roulette .roulette #roulette></Roulette>
		
		<div .controls>
			<button (click)='roulette.run()'>Крутить рулетку</button>
			<button (click)='add()'>add</button>
		</div>
	`

	constructor() {
		this.texture = wood
		this.sectors = SectorApi.range()
		this.initHandlers()
	}


	initHandlers() {
		this.sectors.on('update', ()=> this.onSectorsUpdate())
	}


	onSectorsUpdate() {
		this.scope.roulette.updateSectors(this.sectors)
	}


	add() {
		// this.sectors.push(45)
	}

}

