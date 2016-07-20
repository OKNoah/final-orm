import server from '../../core/server'
import style from './info.styl'


export default class Info {

	static tag = 'info'
	static style = style

	static template = `
			<div .server-connection-error *if="!server.connected">
				Соединение с сервером разорвано, пробуем восстановить...
			</div>
	`

	constructor() {
		this.server = server
	}

}

