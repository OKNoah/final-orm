export default class Cookies {


	static get(name) {
		let regExp = new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)');
		let matches = document.cookie.match(regExp);
		if (matches) return decodeURIComponent(matches[1]);
	}


	static set(name, value, options) {
		var d, expires, propName, propValue, updatedCookie;
		if (options == null) {
			options = {};
		}
		expires = options.expires;
		if (expires && typeof expires === 'number') {
			d = new Date;
			d.setTime(d.getTime() + expires * 1000);
			expires = options.expires = d;
		}
		if (expires && expires.toUTCString) {
			options.expires = expires.toUTCString();
		}
		value = encodeURIComponent(value);
		updatedCookie = name + '=' + value;
		for (propName in options) {
			updatedCookie += '; ' + propName;
			propValue = options[propName];
			if (propValue !== true) {
				updatedCookie += '=' + propValue;
			}
		}
		document.cookie = updatedCookie;
		return value;
	};


	static remove(name) {
		this.set(name, '', {
			expires: -1
		});
	};


}

