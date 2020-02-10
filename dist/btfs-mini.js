(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["BTFS"] = factory();
	else
		root["BTFS"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var XMLHttpRequest = __webpack_require__(1);

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
      var pinningURI = self.provider.pinning && opts.uri === '/add' ? '?pin=true' : '';

      if (options.payload) {
        request.open('POST', `${self.requestBase}${opts.uri}${pinningURI}`);
      } else {
        request.open('GET', `${self.requestBase}${opts.uri}${pinningURI}`);
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

/**
 * Get an object stat `/object/stat` for an BTFS hash
 * @param {String} `BTFSHash` a single BTFS hash String
 * @param {Function} `callback` a callback, with (error, stats Object)
 * @callback {Object} `stats` returns the stats object for that BTFS hash
 */
BTFS.prototype.stat = function cat(BTFSHash, callback) {
  var self = this;
  return self.sendAsync({ jsonParse: true, uri: `/object/stat/${BTFSHash}` }, callback);
};

/**
 * Get the data from an BTFS hash
 * @param {String} `BTFSHash` a single BTFS hash String
 * @param {Function} `callback` a callback, with (error, stats Object)
 * @callback {String} `data` returns the output data
 */
BTFS.prototype.cat = function cat(BTFSHash, callback) {
  var self = this;
  return self.sendAsync({ uri: `/cat/${BTFSHash}` }, callback);
};

/**
 * Get the data from an BTFS hash that is a JSON object
 * @param {String} `BTFSHash` a single BTFS hash String
 * @param {Function} `callback` a callback, with (error, json Object)
 * @callback {Object} `data` returns the output data JSON object
 */
BTFS.prototype.catJSON = function catJSON(BTFSHash, callback) {
  var self = this;
  return self.sendAsync({ uri: `/cat/${BTFSHash}`, jsonParse: true }, callback);
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

const XMLHttpRequest = window.XMLHttpRequest; // eslint-disable-line

module.exports = XMLHttpRequest;


/***/ })
/******/ ]);
});