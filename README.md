## BTFS-mini

<div>
  <!-- Dependency Status -->
  <a href="https://david-dm.org/SilentCicero/BTFS-mini">
    <img src="https://david-dm.org/SilentCicero/BTFS-mini.svg"
    alt="Dependency Status" />
  </a>

  <!-- devDependency Status -->
  <a href="https://david-dm.org/SilentCicero/BTFS-mini#info=devDependencies">
    <img src="https://david-dm.org/SilentCicero/BTFS-mini/dev-status.svg" alt="devDependency Status" />
  </a>

  <!-- Build Status -->
  <a href="https://travis-ci.org/SilentCicero/BTFS-mini">
    <img src="https://travis-ci.org/SilentCicero/BTFS-mini.svg"
    alt="Build Status" />
  </a>

  <!-- NPM Version -->
  <a href="https://www.npmjs.org/package/BTFS-mini">
    <img src="http://img.shields.io/npm/v/BTFS-mini.svg"
    alt="NPM version" />
  </a>

  <!-- Test Coverage -->
  <a href="https://coveralls.io/r/SilentCicero/BTFS-mini">
    <img src="https://coveralls.io/repos/github/SilentCicero/BTFS-mini/badge.svg" alt="Test Coverage" />
  </a>

  <!-- Javascript Style -->
  <a href="http://airbnb.io/javascript/">
    <img src="https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg" alt="js-airbnb-style" />
  </a>
</div>

<br />

A super tiny module for querying an btfsnode, that works in the browser and in Node. Only **2.76 kB** compressed!

## Install

```
npm install --save btfs-sdk-mini
```

## Usage

```js
const btfs= require('btfs-sdk-mini');
const btfs= new BTFS({ host: 'xxxx', port: 5001, protocol: 'https' });

BTFS.add('hello world!').then(console.log).catch(console.log);

// result null 'QmTp2hEo8eXRp6wg7jXv1BLCMh5a4F3B7buAUZNZUu772j'

// result null 'hello world!'

BTFS.addJSON({ somevalue: 2, name: 'Nick' }, (err, result) => {
  console.log(err, result);
});

// result null 'QmTp2hEo8eXRp6wg7jXv1BLCMh5a4F3B7buAUZNZUu772j'

```


## Examples

An example of the module in use for the browser, can be found in [./example](./examples).

Inside is a single, no configuration required, HTML file using the `btfs-sdk-mini` module.

## Browser Usage

`btfs-sdk-mini` is completely browserifiable and webpack ready. The main export found in our distributions [dist](./dist) folder is `BTFS`. 

```
<html>
  <body>
    <script type="text/javascript" src="btfs-mini.min.js">
    <script type="text/javascript">
      var btfs= new BTFS({ provider: 'xxxx', protocol: 'https' });

      // ...
    </script>
  </body>
</html>
```

## API Design

### add


Result output `BTFSHash` **String**.

```js
const btfs= require('BTFS-mini');
const btfs= new BTFS({ host: 'BTFS.infura.io', port: 5001, protocol: 'https' });

BTFS.add('hello world!', (err, result) => {
  console.log(err, result);
});

// result null 'QmTp2hEo8eXRp6wg7jXv1BLCMh5a4F3B7buAUZNZUu772j'
```



