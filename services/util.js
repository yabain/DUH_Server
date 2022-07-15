/**
 * Some useful utilities
 * @author dassiorleando
 */

/**
 * Default callaback doing nothing
 * @returns {void}
 */
exports.noop = function () {
}

/**
 * Prints error
 * @param {Object} error The error to show
 * @returns {void}
 */
exports.error = function (error) {
  console.error('❌ Something went wrong', error);
}

/**
 * @param user the user to generate basic details from
 */
exports.basicUserDetails = function (user) {
  if (!user) return {};

  return {
    _id: user._id,
    username: user.userName,
    email: user.email
  }
}

/**
 * Converting object to array helpful to quickly do Redis hset operations
 */
 exports.objectToArray = function (object) {
  var array = [];
  if (!object) return array;

  // Looping over the object fields
  for (var field in object) {
    if (object.hasOwnProperty(field)) {
      var value = object[field];

      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }

      // Pushing field and value into the array
      array.push(field, value && value !== 'null' ? value : '');
    }
  }

  return array;
}

/**
 * Get unique error field name
 */
var getUniqueErrorMessage = function (err) {
  var output;

  try {
    var fieldName = err.errmsg.substring(err.errmsg.lastIndexOf('.$') + 2, err.errmsg.lastIndexOf('_1'));
    output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';

  } catch (ex) {
    output = 'Unique field already exists';
  }

  return output;
};

/**
 * Get the error message from error object
 */
exports.getErrorMessage = function (err) {
  var message = '';

  if (typeof err === 'string') {
    message = err;
  } else if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = getUniqueErrorMessage(err);
        break;
      case 'LIMIT_FILE_SIZE': // multer error on file size
        message = err.message;
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) {
        message = err.errors[errName].message;
      }
    }
  }

  return message;
};

/**
* Generate a random string
*/
function s4() {
  return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
}

/**
 * Generate a random and almost unique string.
 * @param {string} separator The separator (optional).
 */
exports.generateUUID = function (separator = '') {
  const strings = [s4(), s4(), s4(), s4(), s4(), s4(), s4(), s4()];
  return strings.join(separator);
}
