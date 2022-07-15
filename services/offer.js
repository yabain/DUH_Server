/**
 * Offer service
 * @author dassiorleando
 */
const Offer = require('../models/Offer');

/**
 * Get a specific offer by id
 * @param {string} offerId The offer's id
 * @returns {Promise<Object>} Promise that resolves to the offer found
 */
exports.findById = function (offerId) {
  if (!offerId) return Promise.reject({ success: false, message: 'Not found as empty identifier sent' });
  
  // The incomming parameter can be either the offer's Id or its Key
  var query = {
    _id: offerId
  };

  // Perform the find operation
  return Offer.findOne(query);
};

/**
 * Creates a offer
 * @param {Object} offer The offer details to create
 * @returns {Promise<Object>} Promise that resolves to the created offer
 */
exports.create = function (offer) {
  if (!offer) return Promise.reject({ success: false, message: 'Bad data provided' });
  return Offer.create(offer);
}

/**
* Loads all offers
* @param {Object} query the query object
* @param {Object} projection projected fields to add/remove
* @param {Object} sort sorting criteria
* @returns {Promise<Object>} Promise that resolves to the offers list
*/
exports.findAll = function (query = {}, projection = {}, sort = {}) {
  return Offer.find(query, projection, sort);
}

/**
* Loads one offer
* @param {Object} query the query object
* @param {Object} projection projected fields to add/remove
* @returns {Promise<Object>} Promise that resolves to the offer found
*/
function findOne (query = {}, projection = {}) {
  return Offer.findOne(query, projection);
}
exports.findOne = findOne;
