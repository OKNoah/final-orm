Promise = require('ui-js/core/promise')  


createRequestData = (data, path, formData = new FormData)->
	unless ui.isObject(data) then return data
	if data instanceof FormData then return data
	if data instanceof Blob then return data
	if data instanceof ArrayBuffer then return data
	if data instanceof Document then return data

	for key, value of data
		if ui.isFunction(value) then continue
		value = createRequestData(value, key, formData)
		if value instanceof FormData then continue
		if path then key = "#{path}[#{key}]"
		formData.append(key, value)

	return formData


parseHeaders = (xhr)->
	headers = {}
	headersString = xhr.getAllResponseHeaders()
	regExp = /\s*(.+?)\s*:\s*(.+)\s*/img
	headersString.replace regExp, (header, name, value)->
		headers[name] = value
	return headers


parseData = (xhr)->
	data = xhr.response
	if ui.isString(data)
		try data = JSON.parse(data)
	return data


createResponse = (xhr)->
	url = xhr.responseURL
	status = xhr.status
	statusText = xhr.statusText
	data = parseData(xhr)
	headers = parseHeaders(xhr)
	return {url, status, statusText, data, headers}


setRequestHeaders = (xhr, headers)->
	for own name, value of headers
		xhr.setRequestHeader(name, value)
	return


request = ({method, url, data, headers, async=false})->
	headers ?= {}
	async ?= on
	data ?= null

	xhr = new XMLHttpRequest()
	xhr.open(method, url, async)
	setRequestHeaders(xhr, headers)
	requestData = createRequestData(data)

	unless async
		xhr.send(requestData)
		return createResponse(xhr)

	return new Promise (resolve, reject, progress)->
		xhr.addEventListener 'abort', reject
		xhr.addEventListener 'error', reject
		xhr.addEventListener 'load', ->
			resolve(createResponse(xhr))
			return

		xhr.addEventListener 'progress', (event)->
			unless event.lengthComputable then completed = 0
			else completed = event.loaded / event.total
			progress(completed, 'download')
			return

		xhr.upload.addEventListener 'progress', (event)->
			progress(event.loaded / event.total, 'upload')
			return

		xhr.send(requestData)
		return


get = (url, async)-> request({method: 'GET', url, async})
get.post = (url, data, async)-> request({method: 'POST', url, async, data})
get.head = (url, async)-> request({method: 'HEAD', url, async})

get.request = request
get.get = get

module.exports = get

