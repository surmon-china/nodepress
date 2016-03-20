
/**
 * Expose compositor.
 */

module.exports = compose;

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose(middleware){
  return function *(next){
    var i = middleware.length;
    var prev = next || noop();
    var curr;

    while (i--) {
      curr = middleware[i];
      prev = curr.call(this, prev);
    }

    yield *prev;
  }
}

/**
 * Noop.
 *
 * @api private
 */

function *noop(){}
