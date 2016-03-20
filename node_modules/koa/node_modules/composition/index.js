
var Promise = require('native-or-bluebird');
var co = require('co');

module.exports = compose;

compose.Wrap = Wrap;

function compose(middleware) {
  return function (next) {
    next = next || new Wrap(noop);
    var i = middleware.length;
    while (i--) next = new Wrap(middleware[i], this, next);
    return next
  }
}

/**
 * Wrap a function, then lazily call it,
 * always returning both a promise and a generator.
 *
 * @param {Function} fn
 * @param {Object} ctx
 * @param {Wrap} next
 */

function Wrap(fn, ctx, next) {
  if (typeof fn !== 'function') throw TypeError('Not a function!');
  this._fn = fn;
  this._ctx = ctx;
  this._next = next;
  this._called = false;
  this._value = undefined;
  this._promise = undefined;
  this._generator = undefined;
}

/**
 * Lazily call the function.
 * Note that if it's not an async or generator function,
 *
 * @returns {Mixed}
 */

Wrap.prototype._getValue = function () {
  if (!this._called) {
    this._called = true;
    try {
      this._value = this._fn.call(this._ctx, this._next);
    } catch (e) {
      this._value = Promise.reject(e);
    }
  }
  return this._value
};

/**
 * Lazily create a promise from the return value.
 *
 * @returns {Promise}
 */

Wrap.prototype._getPromise = function () {
  if (this._promise === undefined) {
    var value = this._getValue();
    this._promise = isGenerator(value)
      ? co.call(this._ctx, value)
      : Promise.resolve(value);
  }
  return this._promise
}

/**
 * Lazily create a generator from the return value.
 *
 * @returns {Iterator}
 */

Wrap.prototype._getGenerator = function () {
  if (this._generator === undefined) {
    var value = this._getValue();
    this._generator = isGenerator(value)
      ? value
      : promiseToGenerator.call(this._ctx, value);
  }
  return this._generator
}

/**
 * In later version of v8,
 * `yield*` works on the `[@@iterator]` method.
 *
 * @returns {Iterator}
 */

if (typeof Symbol !== 'undefined') {
  Wrap.prototype[Symbol.iterator] = function () {
    return this._getGenerator();
  }
}

/**
 * This creates a generator from a promise or a value.
 *
 * TODO: try to avoid using a generator function for this.
 *
 * @returns {Iterator}
 */

var loggedDeprecationMessage = false;
function* promiseToGenerator(promise) {
  if (!loggedDeprecationMessage) {
    console.error('A promise was converted into a generator, which is an anti-pattern. Please avoid using `yield* next`!')
    loggedDeprecationMessage = true;
  }
  return yield Promise.resolve(promise);
}

/**
 * Proxy generator and promise methods.
 */

Wrap.prototype.then = function (resolve, reject) {
  return this._getPromise().then(resolve, reject);
}

Wrap.prototype.catch = function (reject) {
  return this._getPromise().catch(reject);
}

Wrap.prototype.next = function (val) {
  return this._getGenerator().next(val);
}

Wrap.prototype.throw = function (err) {
  return this._getGenerator().throw(err);
}

/**
 * Check if `obj` is a generator.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 */

function isGenerator(obj) {
  return obj
    && typeof obj.next === 'function'
    && typeof obj.throw === 'function';
}

function noop() {}
