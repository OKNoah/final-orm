// Generated by CoffeeScript 1.10.0
var Promise, createRequestData, createResponse, get, parseData, parseHeaders, request, setRequestHeaders,
  hasProp = {}.hasOwnProperty;

Promise = require('ui-js/core/promise');

createRequestData = function(data, path, formData) {
  var key, value;
  if (formData == null) {
    formData = new FormData;
  }
  if (!ui.isObject(data)) {
    return data;
  }
  if (data instanceof FormData) {
    return data;
  }
  if (data instanceof Blob) {
    return data;
  }
  if (data instanceof ArrayBuffer) {
    return data;
  }
  if (data instanceof Document) {
    return data;
  }
  for (key in data) {
    value = data[key];
    if (ui.isFunction(value)) {
      continue;
    }
    value = createRequestData(value, key, formData);
    if (value instanceof FormData) {
      continue;
    }
    if (path) {
      key = path + "[" + key + "]";
    }
    formData.append(key, value);
  }
  return formData;
};

parseHeaders = function(xhr) {
  var headers, headersString, regExp;
  headers = {};
  headersString = xhr.getAllResponseHeaders();
  regExp = /\s*(.+?)\s*:\s*(.+)\s*/img;
  headersString.replace(regExp, function(header, name, value) {
    return headers[name] = value;
  });
  return headers;
};

parseData = function(xhr) {
  var data;
  data = xhr.response;
  if (ui.isString(data)) {
    try {
      data = JSON.parse(data);
    } catch (undefined) {}
  }
  return data;
};

createResponse = function(xhr) {
  var data, headers, status, statusText, url;
  url = xhr.responseURL;
  status = xhr.status;
  statusText = xhr.statusText;
  data = parseData(xhr);
  headers = parseHeaders(xhr);
  return {
    url: url,
    status: status,
    statusText: statusText,
    data: data,
    headers: headers
  };
};

setRequestHeaders = function(xhr, headers) {
  var name, value;
  for (name in headers) {
    if (!hasProp.call(headers, name)) continue;
    value = headers[name];
    xhr.setRequestHeader(name, value);
  }
};

request = function(arg) {
  var async, data, headers, method, ref, requestData, url, xhr;
  method = arg.method, url = arg.url, data = arg.data, headers = arg.headers, async = (ref = arg.async) != null ? ref : false;
  if (headers == null) {
    headers = {};
  }
  if (async == null) {
    async = true;
  }
  if (data == null) {
    data = null;
  }
  xhr = new XMLHttpRequest();
  xhr.open(method, url, async);
  setRequestHeaders(xhr, headers);
  requestData = createRequestData(data);
  if (!async) {
    xhr.send(requestData);
    return createResponse(xhr);
  }
  return new Promise(function(resolve, reject, progress) {
    xhr.addEventListener('abort', reject);
    xhr.addEventListener('error', reject);
    xhr.addEventListener('load', function() {
      resolve(createResponse(xhr));
    });
    xhr.addEventListener('progress', function(event) {
      var completed;
      if (!event.lengthComputable) {
        completed = 0;
      } else {
        completed = event.loaded / event.total;
      }
      progress(completed, 'download');
    });
    xhr.upload.addEventListener('progress', function(event) {
      progress(event.loaded / event.total, 'upload');
    });
    xhr.send(requestData);
  });
};

get = function(url, async) {
  return request({
    method: 'GET',
    url: url,
    async: async
  });
};

get.post = function(url, data, async) {
  return request({
    method: 'POST',
    url: url,
    async: async,
    data: data
  });
};

get.head = function(url, async) {
  return request({
    method: 'HEAD',
    url: url,
    async: async
  });
};

get.request = request;

get.get = get;

module.exports = get;

//# sourceMappingURL=http.js.map