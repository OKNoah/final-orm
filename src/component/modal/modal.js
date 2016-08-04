import Popup from '../popup/popup'
import style from './modal.styl'


export default class Modal extends Popup {

	static tag = 'modal'
	static style = style

	static template = `
		<div .content #content>
			<div .scale .modal #scale>
				<content></content>
			</div>
		</div>
	`

}



