Popup = require('../popup/popup')


module.exports = class Modal extends Popup

	@selector: 'modal'
	@styles: Popup.styles.concat [require('./modal.styl')]
	@template: "
		<div #content .content>
			<div #scale .scale .modal>
				<content></content>
			</div>
		</div>
	"

