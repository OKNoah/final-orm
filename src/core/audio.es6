import Promise from 'ui-js/core/promise'


export default class Audio {


	constructor() {
		this.audioContext = new AudioContext()
		this.soundBuffersLoadPromises = {}
	}


	playSound(url, volume = 1) {
		this.loadSound(url).then((buffer)=>
			this.playSoundBuffer(buffer, volume)
		)
	}


	playSoundBuffer(buffer, volume) {
		let gainNode = this.audioContext.createGain()
		gainNode.gain.value = volume
		let source = this.audioContext.createBufferSource()
		source.buffer = buffer
		source.connect(gainNode)
		gainNode.connect(this.audioContext.destination)
		source.start(0)
	}


	loadSound(url) {
		if (this.soundBuffersLoadPromises[url]) {
			return this.soundBuffersLoadPromises[url]
		}

		let promise = new Promise()
		let request = new XMLHttpRequest()
		request.open('GET', url, true)
		request.responseType = 'arraybuffer'

		request.addEventListener('load', ()=> {
			let audioData = request.response
			this.audioContext.decodeAudioData(audioData, promise.resolve, promise.reject)
		})

		request.send()
		this.soundBuffersLoadPromises[url] = promise
		return promise
	}


}

