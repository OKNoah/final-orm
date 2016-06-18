'use strict';

var _class, _temp;

var _arangojs = require('arangojs');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sector = (_temp = _class = function Sector() {
	_classCallCheck(this, Sector);
}, _class.schema = {
	name: String,
	friends: [{
		name: String,
		age: 33
	}]
}, _temp);

// @Collection('sectors')
//
// class Sector extends Item {
//
// 	@Property(true)
// 	www
//
// 	// @Property(String)
// 	// contentTexture
// 	//
// 	// @Property(String)
// 	// user // ссылка на юзера
//
// }
//
//
// class Sectors extends List {
//
//
// 	async add(data) {
// 		// data.texture = await Utils.saveImage(data.texture, 'jpg', 1024, 1024)
// 		// data.contentTexture = await Utils.saveImage(data.contentTexture, 'jpg', 1024, 1024)
// 		// let newUser = await Users.add({login: 'dd', pass: 'dsds'})
// 		// data.user = newUser._id
//
// 		return super.add({www: 'trololo'})
// 	}
//
//
// 	async remove(data) {
// 		let sector = await this.get()
// 		console.log(sector.www)
// 		// console.log(await sector.user)
// 		// await Utils.remove(sector.texture)
// 		// await Utils.remove(sector.contentTexture)
// 		// return super.remove(data)
// 	}
//
//
// }
//
//
// class SectorsApi extends ListApi {
//
// 	name = 'sectors'
//
// }
//
//
// export default new Sectors(Sector, SectorsApi)
//

//# sourceMappingURL=sectors.js.map