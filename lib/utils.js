"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});

var _typeof =
    typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
        ? function(obj) {
              return typeof obj;
          }
        : function(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype
                  ? "symbol"
                  : typeof obj;
          };

/**
 * @module utils
 * @description
 * Offers a series of generic methods for object manipulation, and other operations
 * that are common across rd3g such as error logging.
 */

// This variable assures that recursive methods such as merge and isDeepEqual do not fall on
// circular JSON structure evaluation.
var MAX_DEPTH = 20;

/**
 * Checks whether a certain object property is from object type and is a non empty object.
 * @param  {Object} o - the object.
 * @param  {string} k - the object property.
 * @returns {boolean} returns true if o[k] is an non empty object.
 * @memberof utils
 */
function _isPropertyNestedObject(o, k) {
    return !!o && o.hasOwnProperty(k) && _typeof(o[k]) === "object" && o[k] !== null && !isEmptyObject(o[k]);
}

/**
 * Generic deep comparison between javascript simple or complex objects.
 * @param  {Object} o1 - one of the objects to be compared.
 * @param  {Object} o2 - second object to compare with first.
 * @param  {number} [_depth=0] - this parameter serves only for internal usage.
 * @returns {boolean} returns true if o1 and o2 have exactly the same content, or are exactly the same object reference.
 * @memberof utils
 */
function isDeepEqual(o1, o2) {
    var _depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    var diffs = [];

    if (_depth === 0 && o1 === o2) {
        return true;
    }

    if ((isEmptyObject(o1) && !isEmptyObject(o2)) || (!isEmptyObject(o1) && isEmptyObject(o2))) {
        return false;
    }

    var o1Keys = Object.keys(o1);
    var o2Keys = Object.keys(o2);

    if (o1Keys.length !== o2Keys.length) {
        return false;
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (
            var _iterator = o1Keys[Symbol.iterator](), _step;
            !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
            _iteratorNormalCompletion = true
        ) {
            var k = _step.value;

            var nestedO = _isPropertyNestedObject(o1, k) && _isPropertyNestedObject(o2, k);

            if (nestedO && _depth < MAX_DEPTH) {
                diffs.push(isDeepEqual(o1[k], o2[k], _depth + 1));
            } else {
                var r = (isEmptyObject(o1[k]) && isEmptyObject(o2[k])) || (o2.hasOwnProperty(k) && o2[k] === o1[k]);

                diffs.push(r);

                if (!r) {
                    break;
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return diffs.indexOf(false) === -1;
}

/**
 * Checks whether or not a certain object is empty.
 * NOTE: If the passed parameter is not an object the method return false.
 * @param  {Object}  o - object whom emptiness we want to check.
 * @returns {boolean} true if the given object is n ft and object and is empty.
 * @memberof utils
 */
function isEmptyObject(o) {
    return !!o && (typeof o === "undefined" ? "undefined" : _typeof(o)) === "object" && !Object.keys(o).length;
}

/**
 * Function to deep clone plain javascript objects.
 * @param {Object} o - the object to clone.
 * @param {Object} _clone - carries the cloned output throughout the
 * recursive calls. Parameter serves only for internal usage.
 * @param {number} _depth - this parameter serves only for internal usage.
 * @returns {Object} - the cloned object.
 * @memberof utils
 */
function deepClone(o) {
    var _clone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    // TODO: Handle invalid input o is null, undefined, empty object
    var oKeys = Object.keys(o);

    // TODO: handle arrays
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (
            var _iterator2 = oKeys[Symbol.iterator](), _step2;
            !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
            _iteratorNormalCompletion2 = true
        ) {
            var k = _step2.value;

            var nested = _isPropertyNestedObject(o, k);

            _clone[k] = nested && _depth < MAX_DEPTH ? deepClone(o[k], {}, _depth + 1) : o[k];
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return _clone;
}

/**
 * This function merges two objects o1 and o2, where o2 properties override existent o1 properties, and
 * if o2 doesn't posses some o1 property the fallback will be the o1 property.
 * @param  {Object} o1 - object.
 * @param  {Object} o2 - object that will override o1 properties.
 * @param  {int} [_depth=0] - the depth at which we are merging the object.
 * @returns {Object} object that is the result of merging o1 and o2, being o2 properties priority overriding
 * existent o1 properties.
 * @memberof utils
 */
function merge() {
    var o1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var o2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    var o = {};

    if (Object.keys(o1 || {}).length === 0) {
        return o2 && !isEmptyObject(o2) ? o2 : {};
    }

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (
            var _iterator3 = Object.keys(o1)[Symbol.iterator](), _step3;
            !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done);
            _iteratorNormalCompletion3 = true
        ) {
            var k = _step3.value;

            var nestedO = !!(o2[k] && _typeof(o2[k]) === "object" && _typeof(o1[k]) === "object" && _depth < MAX_DEPTH);

            if (nestedO) {
                (function() {
                    var r = merge(o1[k], o2[k], _depth + 1);

                    o[k] =
                        o1[k].hasOwnProperty("length") && o2[k].hasOwnProperty("length")
                            ? Object.keys(r).map(function(rk) {
                                  return r[rk];
                              })
                            : r;
                })();
            } else {
                o[k] = o2.hasOwnProperty(k) ? o2[k] : o1[k];
            }
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    return o;
}

/**
 * Create new object from the inputted one only with the props passed
 * in the props list.
 * @param {Object} o - the object to pick props from.
 * @param {Array.<string>} props - list of props that we want to pick from o.
 * @returns {Object} the object resultant from the picking operation.
 * @memberof utils
 */
function pick(o) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    return props.reduce(function(acc, k) {
        if (o.hasOwnProperty(k)) {
            acc[k] = o[k];
        }

        return acc;
    }, {});
}

/**
 * Picks all props except the ones passed in the props array.
 * @param {Object} o - the object to pick props from.
 * @param {Array.<string>} props - list of props that we DON'T want to pick from o.
 * @returns {Object} the object resultant from the anti picking operation.
 * @memberof utils
 */
function antiPick(o) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var wanted = Object.keys(o).filter(function(k) {
        return !props.includes(k);
    });

    return pick(o, wanted);
}

/**
 * Helper function for customized error logging.
 * @param  {string} component - the name of the component where the error is to be thrown.
 * @param  {string} msg - the message contain a more detailed explanation about the error.
 * @returns {Error} the thrown error.
 * @memberof utils
 */
function throwErr(component, msg) {
    var error = "react-d3-graph :: " + component + " :: " + msg;

    throw Error(error);
}

exports.default = {
    isDeepEqual: isDeepEqual,
    isEmptyObject: isEmptyObject,
    deepClone: deepClone,
    merge: merge,
    pick: pick,
    antiPick: antiPick,
    throwErr: throwErr,
};
