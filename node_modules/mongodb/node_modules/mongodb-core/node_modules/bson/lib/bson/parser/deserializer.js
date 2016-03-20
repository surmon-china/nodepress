"use strict"

var readIEEE754 = require('../float_parser').readIEEE754,
	f = require('util').format,
	Long = require('../long').Long,
  Double = require('../double').Double,
  Timestamp = require('../timestamp').Timestamp,
  ObjectID = require('../objectid').ObjectID,
  Symbol = require('../symbol').Symbol,
  Code = require('../code').Code,
  MinKey = require('../min_key').MinKey,
  MaxKey = require('../max_key').MaxKey,
  DBRef = require('../db_ref').DBRef,
  BSONRegExp = require('../regexp').BSONRegExp,
  Binary = require('../binary').Binary;

var deserialize = function(buffer, options, isArray) {
	options = options == null ? {} : options;
	var index = options && options.index ? options.index : 0;
	// Read the document size
  var size = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;

	// Ensure buffer is valid size
  if(size < 5 || buffer.length < size) {
		throw new Error("corrupt bson message");
	}

	// Illegal end value
	if(buffer[size - 1] != 0) {
		throw new Error("One object, sized correctly, with a spot for an EOO, but the EOO isn't 0x00");
	}

	// Start deserializtion
	return deserializeObject(buffer, index - 4, options, isArray);
}

var deserializeObject = function(buffer, index, options, isArray) {
	var evalFunctions = options['evalFunctions'] == null ? false : options['evalFunctions'];
  var cacheFunctions = options['cacheFunctions'] == null ? false : options['cacheFunctions'];
  var cacheFunctionsCrc32 = options['cacheFunctionsCrc32'] == null ? false : options['cacheFunctionsCrc32'];
  var promoteLongs = options['promoteLongs'] == null ? true : options['promoteLongs'];
	var fieldsAsRaw = options['fieldsAsRaw'] == null ? null : options['fieldsAsRaw'];
	var raw = options['raw'] == null ? false : options['raw'];
  // Return BSONRegExp objects instead of native regular expressions
  var bsonRegExp = typeof options['bsonRegExp'] == 'boolean' ? options['bsonRegExp'] : false;
  var promoteBuffers = options['promoteBuffers'] == null ? false : options['promoteBuffers'];

  // Validate that we have at least 4 bytes of buffer
  if(buffer.length < 5) throw new Error("corrupt bson message < 5 bytes long");

	// Read the document size
  var size = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;

	// Ensure buffer is valid size
  if(size < 5 || size > buffer.length) throw new Error("corrupt bson message");

  // Create holding object
  var object = isArray ? [] : {};

  // While we have more left data left keep parsing
  while(true) {
    // Read the type
    var elementType = buffer[index++];
    // If we get a zero it's the last byte, exit
    if(elementType == 0) break;

		// Get the start search index
		var i = index;
		// Locate the end of the c string
		while(buffer[i] !== 0x00 && i < buffer.length) {
			i++
		}

		// If are at the end of the buffer there is a problem with the document
		if(i >= buffer.length) throw new Error("Bad BSON Document: illegal CString")
		var name = buffer.toString('utf8', index, i);

		index = i + 1;

		if(elementType == BSON.BSON_DATA_STRING) {
      var stringSize = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
			if(stringSize <= 0 || stringSize > (buffer.length - index) || buffer[index + stringSize - 1] != 0) throw new Error("bad string length in bson");
      object[name] = buffer.toString('utf8', index, index + stringSize - 1);
      index = index + stringSize;
		} else if(elementType == BSON.BSON_DATA_OID) {
      var string = buffer.toString('binary', index, index + 12);
      object[name] = new ObjectID(string);
      index = index + 12;
		} else if(elementType == BSON.BSON_DATA_INT) {
      object[name] = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
		} else if(elementType == BSON.BSON_DATA_NUMBER) {
			object[name] = buffer.readDoubleLE(index);
      index = index + 8;
		} else if(elementType == BSON.BSON_DATA_DATE) {
      var lowBits = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
      var highBits = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
      object[name] = new Date(new Long(lowBits, highBits).toNumber());
		} else if(elementType == BSON.BSON_DATA_BOOLEAN) {
      object[name] = buffer[index++] == 1;
		} else if(elementType == BSON.BSON_DATA_OBJECT) {
			var _index = index;
      var objectSize = buffer[index] | buffer[index + 1] << 8 | buffer[index + 2] << 16 | buffer[index + 3] << 24;
			if(objectSize <= 0 || objectSize > (buffer.length - index)) throw new Error("bad embedded document length in bson");

			// We have a raw value
			if(raw) {
	      object[name] = buffer.slice(index, index + objectSize);
			} else {
	      object[name] = deserializeObject(buffer, _index, options, false);
			}

      index = index + objectSize;
		} else if(elementType == BSON.BSON_DATA_ARRAY) {
			var _index = index;
      var objectSize = buffer[index] | buffer[index + 1] << 8 | buffer[index + 2] << 16 | buffer[index + 3] << 24;
			var arrayOptions = options;

			// All elements of array to be returned as raw bson
			if(fieldsAsRaw && fieldsAsRaw[name]) {
				arrayOptions = {};
				for(var n in options) arrayOptions[n] = options[n];
				arrayOptions['raw'] = true;
			}

      object[name] = deserializeObject(buffer, _index, arrayOptions, true);
      index = index + objectSize;
		} else if(elementType == BSON.BSON_DATA_UNDEFINED || elementType == BSON.BSON_DATA_NULL) {
      object[name] = null;
		} else if(elementType == BSON.BSON_DATA_LONG) {
      // Unpack the low and high bits
      var lowBits = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
      var highBits = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
      var long = new Long(lowBits, highBits);
      // Promote the long if possible
      if(promoteLongs) {
        object[name] = long.lessThanOrEqual(JS_INT_MAX_LONG) && long.greaterThanOrEqual(JS_INT_MIN_LONG) ? long.toNumber() : long;
      } else {
        object[name] = long;
      }
		} else if(elementType == BSON.BSON_DATA_BINARY) {
      var binarySize = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
      var subType = buffer[index++];
      // Decode as raw Buffer object if options specifies it
      if(buffer['slice'] != null) {
        // If we have subtype 2 skip the 4 bytes for the size
        if(subType == Binary.SUBTYPE_BYTE_ARRAY) {
          binarySize = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
        }
        if(promoteBuffers) {
          object[name] = buffer.slice(index, index + binarySize);
        } else {
          object[name] = new Binary(buffer.slice(index, index + binarySize), subType);
        }
      } else {
        var _buffer = typeof Uint8Array != 'undefined' ? new Uint8Array(new ArrayBuffer(binarySize)) : new Array(binarySize);
        // If we have subtype 2 skip the 4 bytes for the size
        if(subType == Binary.SUBTYPE_BYTE_ARRAY) {
          binarySize = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
        }
        // Copy the data
        for(var i = 0; i < binarySize; i++) {
          _buffer[i] = buffer[index + i];
        }
        if(promoteBuffers) {
          object[name] = _buffer;
        } else {
          object[name] = new Binary(_buffer, subType);
        }
      }
      // Update the index
      index = index + binarySize;
		} else if(elementType == BSON.BSON_DATA_REGEXP && bsonRegExp == false) {
			// Get the start search index
			var i = index;
			// Locate the end of the c string
			while(buffer[i] !== 0x00 && i < buffer.length) {
				i++
			}
			// If are at the end of the buffer there is a problem with the document
			if(i >= buffer.length) throw new Error("Bad BSON Document: illegal CString")
			// Return the C string
			var source = buffer.toString('utf8', index, i);
      // Create the regexp
			index = i + 1;

			// Get the start search index
			var i = index;
			// Locate the end of the c string
			while(buffer[i] !== 0x00 && i < buffer.length) {
				i++
			}
			// If are at the end of the buffer there is a problem with the document
			if(i >= buffer.length) throw new Error("Bad BSON Document: illegal CString")
			// Return the C string
			var regExpOptions = buffer.toString('utf8', index, i);
			index = i + 1;

      // For each option add the corresponding one for javascript
      var optionsArray = new Array(regExpOptions.length);

      // Parse options
      for(var i = 0; i < regExpOptions.length; i++) {
        switch(regExpOptions[i]) {
          case 'm':
            optionsArray[i] = 'm';
            break;
          case 's':
            optionsArray[i] = 'g';
            break;
          case 'i':
            optionsArray[i] = 'i';
            break;
        }
      }

      object[name] = new RegExp(source, optionsArray.join(''));
    } else if(elementType == BSON.BSON_DATA_REGEXP && bsonRegExp == true) {
			// Get the start search index
			var i = index;
			// Locate the end of the c string
			while(buffer[i] !== 0x00 && i < buffer.length) {
				i++
			}
			// If are at the end of the buffer there is a problem with the document
			if(i >= buffer.length) throw new Error("Bad BSON Document: illegal CString")
			// Return the C string
			var source = buffer.toString('utf8', index, i);
      index = i + 1;

			// Get the start search index
			var i = index;
			// Locate the end of the c string
			while(buffer[i] !== 0x00 && i < buffer.length) {
				i++
			}
			// If are at the end of the buffer there is a problem with the document
			if(i >= buffer.length) throw new Error("Bad BSON Document: illegal CString")
			// Return the C string
			var regExpOptions = buffer.toString('utf8', index, i);
      index = i + 1;

      // Set the object
      object[name] = new BSONRegExp(source, regExpOptions);
		} else if(elementType == BSON.BSON_DATA_SYMBOL) {
      var stringSize = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
			if(stringSize <= 0 || stringSize > (buffer.length - index) || buffer[index + stringSize - 1] != 0) throw new Error("bad string length in bson");
      object[name] = new Symbol(buffer.toString('utf8', index, index + stringSize - 1));
      index = index + stringSize;
		} else if(elementType == BSON.BSON_DATA_TIMESTAMP) {
      var lowBits = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
      var highBits = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
      object[name] = new Timestamp(lowBits, highBits);
		} else if(elementType == BSON.BSON_DATA_MIN_KEY) {
      object[name] = new MinKey();
		} else if(elementType == BSON.BSON_DATA_MAX_KEY) {
      object[name] = new MaxKey();
		} else if(elementType == BSON.BSON_DATA_CODE) {
      var stringSize = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
			if(stringSize <= 0 || stringSize > (buffer.length - index) || buffer[index + stringSize - 1] != 0) throw new Error("bad string length in bson");
      var functionString = buffer.toString('utf8', index, index + stringSize - 1);

      // If we are evaluating the functions
      if(evalFunctions) {
        var value = null;
        // If we have cache enabled let's look for the md5 of the function in the cache
        if(cacheFunctions) {
          var hash = cacheFunctionsCrc32 ? crc32(functionString) : functionString;
          // Got to do this to avoid V8 deoptimizing the call due to finding eval
          object[name] = isolateEvalWithHash(functionCache, hash, functionString, object);
        } else {
          object[name] = isolateEval(functionString);
        }
      } else {
        object[name]  = new Code(functionString, {});
      }

      // Update parse index position
      index = index + stringSize;
		} else if(elementType == BSON.BSON_DATA_CODE_W_SCOPE) {
      var totalSize = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
      var stringSize = buffer[index++] | buffer[index++] << 8 | buffer[index++] << 16 | buffer[index++] << 24;
			if(stringSize <= 0 || stringSize > (buffer.length - index) || buffer[index + stringSize - 1] != 0) throw new Error("bad string length in bson");
      // Javascript function
      var functionString = buffer.toString('utf8', index, index + stringSize - 1);
      // Update parse index position
      index = index + stringSize;
      // Parse the element
			var _index = index;
      // Decode the size of the object document
      var objectSize = buffer[index] | buffer[index + 1] << 8 | buffer[index + 2] << 16 | buffer[index + 3] << 24;
      // Decode the scope object
      var scopeObject = deserializeObject(buffer, _index, options, false);
      // Adjust the index
      index = index + objectSize;

      // If we are evaluating the functions
      if(evalFunctions) {
        // Contains the value we are going to set
        var value = null;
        // If we have cache enabled let's look for the md5 of the function in the cache
        if(cacheFunctions) {
          var hash = cacheFunctionsCrc32 ? crc32(functionString) : functionString;
          // Got to do this to avoid V8 deoptimizing the call due to finding eval
          object[name] = isolateEvalWithHash(functionCache, hash, functionString, object);
        } else {
          object[name] = isolateEval(functionString);
        }

        object[name].scope = scopeObject;
      } else {
        object[name]  = new Code(functionString, scopeObject);
      }
    }
  }

  // Check if we have a db ref object
  if(object['$id'] != null) object = new DBRef(object['$ref'], object['$id'], object['$db']);
  return object;
}

/**
 * Ensure eval is isolated.
 *
 * @ignore
 * @api private
 */
var isolateEvalWithHash = function(functionCache, hash, functionString, object) {
  // Contains the value we are going to set
  var value = null;

  // Check for cache hit, eval if missing and return cached function
  if(functionCache[hash] == null) {
    eval("value = " + functionString);
    functionCache[hash] = value;
  }
  // Set the object
  return functionCache[hash].bind(object);
}

/**
 * Ensure eval is isolated.
 *
 * @ignore
 * @api private
 */
var isolateEval = function(functionString) {
  // Contains the value we are going to set
  var value = null;
  // Eval the function
  eval("value = " + functionString);
  return value;
}

var BSON = {};

/**
 * Contains the function cache if we have that enable to allow for avoiding the eval step on each deserialization, comparison is by md5
 *
 * @ignore
 * @api private
 */
var functionCache = BSON.functionCache = {};

/**
 * Number BSON Type
 *
 * @classconstant BSON_DATA_NUMBER
 **/
BSON.BSON_DATA_NUMBER = 1;
/**
 * String BSON Type
 *
 * @classconstant BSON_DATA_STRING
 **/
BSON.BSON_DATA_STRING = 2;
/**
 * Object BSON Type
 *
 * @classconstant BSON_DATA_OBJECT
 **/
BSON.BSON_DATA_OBJECT = 3;
/**
 * Array BSON Type
 *
 * @classconstant BSON_DATA_ARRAY
 **/
BSON.BSON_DATA_ARRAY = 4;
/**
 * Binary BSON Type
 *
 * @classconstant BSON_DATA_BINARY
 **/
BSON.BSON_DATA_BINARY = 5;
/**
 * ObjectID BSON Type
 *
 * @classconstant BSON_DATA_OID
 **/
BSON.BSON_DATA_OID = 7;
/**
 * Boolean BSON Type
 *
 * @classconstant BSON_DATA_BOOLEAN
 **/
BSON.BSON_DATA_BOOLEAN = 8;
/**
 * Date BSON Type
 *
 * @classconstant BSON_DATA_DATE
 **/
BSON.BSON_DATA_DATE = 9;
/**
 * null BSON Type
 *
 * @classconstant BSON_DATA_NULL
 **/
BSON.BSON_DATA_NULL = 10;
/**
 * RegExp BSON Type
 *
 * @classconstant BSON_DATA_REGEXP
 **/
BSON.BSON_DATA_REGEXP = 11;
/**
 * Code BSON Type
 *
 * @classconstant BSON_DATA_CODE
 **/
BSON.BSON_DATA_CODE = 13;
/**
 * Symbol BSON Type
 *
 * @classconstant BSON_DATA_SYMBOL
 **/
BSON.BSON_DATA_SYMBOL = 14;
/**
 * Code with Scope BSON Type
 *
 * @classconstant BSON_DATA_CODE_W_SCOPE
 **/
BSON.BSON_DATA_CODE_W_SCOPE = 15;
/**
 * 32 bit Integer BSON Type
 *
 * @classconstant BSON_DATA_INT
 **/
BSON.BSON_DATA_INT = 16;
/**
 * Timestamp BSON Type
 *
 * @classconstant BSON_DATA_TIMESTAMP
 **/
BSON.BSON_DATA_TIMESTAMP = 17;
/**
 * Long BSON Type
 *
 * @classconstant BSON_DATA_LONG
 **/
BSON.BSON_DATA_LONG = 18;
/**
 * MinKey BSON Type
 *
 * @classconstant BSON_DATA_MIN_KEY
 **/
BSON.BSON_DATA_MIN_KEY = 0xff;
/**
 * MaxKey BSON Type
 *
 * @classconstant BSON_DATA_MAX_KEY
 **/
BSON.BSON_DATA_MAX_KEY = 0x7f;

/**
 * Binary Default Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_DEFAULT
 **/
BSON.BSON_BINARY_SUBTYPE_DEFAULT = 0;
/**
 * Binary Function Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_FUNCTION
 **/
BSON.BSON_BINARY_SUBTYPE_FUNCTION = 1;
/**
 * Binary Byte Array Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_BYTE_ARRAY
 **/
BSON.BSON_BINARY_SUBTYPE_BYTE_ARRAY = 2;
/**
 * Binary UUID Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_UUID
 **/
BSON.BSON_BINARY_SUBTYPE_UUID = 3;
/**
 * Binary MD5 Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_MD5
 **/
BSON.BSON_BINARY_SUBTYPE_MD5 = 4;
/**
 * Binary User Defined Type
 *
 * @classconstant BSON_BINARY_SUBTYPE_USER_DEFINED
 **/
BSON.BSON_BINARY_SUBTYPE_USER_DEFINED = 128;

// BSON MAX VALUES
BSON.BSON_INT32_MAX = 0x7FFFFFFF;
BSON.BSON_INT32_MIN = -0x80000000;

BSON.BSON_INT64_MAX = Math.pow(2, 63) - 1;
BSON.BSON_INT64_MIN = -Math.pow(2, 63);

// JS MAX PRECISE VALUES
BSON.JS_INT_MAX = 0x20000000000000;  // Any integer up to 2^53 can be precisely represented by a double.
BSON.JS_INT_MIN = -0x20000000000000;  // Any integer down to -2^53 can be precisely represented by a double.

// Internal long versions
var JS_INT_MAX_LONG = Long.fromNumber(0x20000000000000);  // Any integer up to 2^53 can be precisely represented by a double.
var JS_INT_MIN_LONG = Long.fromNumber(-0x20000000000000);  // Any integer down to -2^53 can be precisely represented by a double.

module.exports = deserialize
