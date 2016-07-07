import ApiError from './errors/api-error'


class Task {

	constructor(connection, options) {
		this.connection = connection
		this.method = options.method
		this.params = options.params

		this.done = false
		this.error = null
		this.result = null
	}


	resolve(result) {
		if (this.done) return
		this.result = result
		this.done = true
	}


	reject(error) {
		if (this.done) return
		this.error = error
		this.done = true
	}


	async run() {
		try {
			var result = await Server.callMethod(this.method, this.params, this.connection)
		} catch (error) {
			if (!(error instanceof ApiError)) {
				error = new ApiError(0, '')
			}
			this.reject(error)
		}
		this.resolve(result)
	}


	toJSON() {
		return {
			error: this.error,
			result: this.result
		}
	}

}

