var XMLHttpRequest = require('./lib/XMLHttpRequest');

module.exports = BTFS;

/**
 * The varructor object
 * @param {Object} `provider` the provider object
 * @return {Object} `BTFS` returns an BTFS instance
 * @throws if the `new` flag is not used
 */
function BTFS(provider) {
  if (!(this instanceof BTFS)) { throw new Error('[BTFS-mini] BTFS instance must be instantiated with "new" flag (e.g. var BTFS = new BTFS("http://localhost:8545");).'); }

  var self = this;
  self.setProvider(provider || {});
}

/**
 * No operation method
 */
function noop() {}
function newPromise(val) { return new Promise(val); }
function noopPromise(val) { val(noop, noop); }

/**
 * Sets the provider of the BTFS instance
 * @param {Object} `provider` the provider object
 * @throws if the provider object is not an object
 */
BTFS.prototype.setProvider = function setProvider(provider) {
  if (typeof provider !== 'object') { throw new Error(`[ifpsjs] provider must be type Object, got '${typeof provider}'.`); }
  var self = this;
  var data = self.provider = Object.assign({
    host: '127.0.0.1',
    pinning: true,
    port: '5001',
    protocol: 'http',
    base: '/api/v0' }, provider || {});
  self.requestBase = String(`${data.protocol}://${data.host}:${data.port}${data.base}`);
};

/**
 * Sends an async data packet to an BTFS node
 * @param {Object} `opts` the options object
 * @param {Function} `cb` the provider callback
 * @callback returns an error if any, or the data from BTFS
 */
BTFS.prototype.sendAsync = function sendAsync(opts, cb) {
  var self = this;
  var request = new XMLHttpRequest(); // eslint-disable-line
  var options = opts || {};

  return (cb ? noopPromise : newPromise)(function (resolve, reject) {
    function callback(e, r){
      (cb || noop)(e, options.takeHash ? r.Hash : r);
      if (e) return reject(e);
      if (!e && r) return resolve(options.takeHash ? r.Hash : r);
    };

    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.timeout !== 1) {
        if (request.status !== 200) {
          callback(new Error(`[BTFS-mini] status ${request.status}: ${request.responseText}`), null);
        } else {
          try {
            callback(null, (options.jsonParse ? JSON.parse(request.responseText) : request.responseText));
          } catch (jsonError) {
            callback(new Error(`[BTFS-mini] while parsing data: '${String(request.responseText)}', error: ${String(jsonError)} with provider: '${self.requestBase}'`, null));
          }
        }
      }
    };

    try {
      var pinningURI = self.provider.pinning && opts.uri == '/add' ? '?pin=true' : '';

      if (options.payload) {
        request.open('POST', `${self.requestBase}${opts.uri}`);
      } else {
        request.open('GET', `${self.requestBase}${opts.uri}`);
      }

      if (options.accept) {
        request.setRequestHeader('accept', options.accept);
      }

      if (options.payload && options.boundary) {
        request.setRequestHeader('Content-Type', `multipart/form-data; boundary=${options.boundary}`);
        request.send(options.payload);
      } else {
        request.send();
      }
    } catch (err) {
      callback(err, null);
    }
  });
};

/**
 * creates a boundary that isn't part of the payload
 */
function createBoundary(data) {
  while (true) {
    var boundary = `----BTFSMini${Math.random() * 100000}.${Math.random() * 100000}`;
    if (data.indexOf(boundary) === -1) {
      return boundary;
    }
  }
}

/**
 * Add an string or buffer to BTFS
 * @param {String|Buffer} `input` a single string or buffer
 * @param {Function} `callback` a callback, with (error, BTFSHash String)
 * @callback {String} `BTFSHash` returns an BTFS hash string
 */
BTFS.prototype.add = function addData(input, callback) {
  var data = ((typeof input === 'object' && input.isBuffer) ? input.toString('binary') : input);
  var boundary = createBoundary(data);
  var payload = `--${boundary}\r\nContent-Disposition: form-data; name="path"\r\nContent-Type: application/octet-stream\r\n\r\n${data}\r\n--${boundary}--`;

  return this.sendAsync({
    jsonParse: true,
    accept: 'application/json',
    uri: '/add',
    takeHash: true,
    payload, boundary,
  }, callback);
};

/**
 * Add an JSON object to BTFS
 * @param {Object} `jsonData` a single JSON object
 * @param {Function} `callback` a callback, with (error, BTFSHash String)
 * @callback {String} `BTFSHash` returns an BTFS hash string
 */
BTFS.prototype.addJSON = function addJson(jsonData, callback) {
  var self = this;
  return self.add(JSON.stringify(jsonData), callback);
};
