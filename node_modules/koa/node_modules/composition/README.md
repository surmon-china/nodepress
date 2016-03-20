
# composition

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

Compose generator and async/await middleware like koa.
Allows to use both generator functions and async/await functions.

```js
var compose = require('composition');

var stack = [];

// generator functions
stack.push(function* (next) {
  yield next;
});

// regular functions that return anything
// but they should be promises!
stack.push(function (next) {
  return Promise.resolve(true);
});

// async/await functions
stack.push(async function (next) {
  return await Promise.resolve(true);
});

// compose it into a function
var fn = compose(stack);

// this function returns a promise
fn.call(this).then(function (val) {
  console.log(val);
}).catch(function (err) {
  console.error(err.stack);
  process.exit(1);
})
```

[gitter-image]: https://badges.gitter.im/thenables/composition.png
[gitter-url]: https://gitter.im/thenables/composition
[npm-image]: https://img.shields.io/npm/v/composition.svg?style=flat-square
[npm-url]: https://npmjs.org/package/composition
[github-tag]: http://img.shields.io/github/tag/thenables/composition.svg?style=flat-square
[github-url]: https://github.com/thenables/composition/tags
[travis-image]: https://img.shields.io/travis/thenables/composition.svg?style=flat-square
[travis-url]: https://travis-ci.org/thenables/composition
[coveralls-image]: https://img.shields.io/coveralls/thenables/composition.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/thenables/composition
[david-image]: http://img.shields.io/david/thenables/composition.svg?style=flat-square
[david-url]: https://david-dm.org/thenables/composition
[license-image]: http://img.shields.io/npm/l/composition.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/composition.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/composition
