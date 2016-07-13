import Popup from '../popup/popup'


export default class Modal extends Popup {

	static selector = 'modal'
	static styles = Popup.styles.concat [require('./modal.styl')]

	static template = `
		<div #content .content>
			<div #scale .scale .modal>
				<content></content>
			</div>
		</div>
	`
}



