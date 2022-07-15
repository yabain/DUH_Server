/**
 * Item service
 * @author dassiorleando
 */
const axios = require("axios");
const Item = require("../models/Item");

/**
 * Get a specific item by id
 * @param {string} itemId The item's id
 * @returns {Promise<Object>} Promise that resolves to the item found
 */
exports.findById = function (itemId) {
  if (!itemId)
    return Promise.reject({
      success: false,
      message: "Not found as empty identifier sent",
    });

  // The incomming parameter can be either the item's Id or its Key
  var query = {
    _id: itemId,
  };

  // Perform the find operation
  return Item.findOne(query);
};

/**
 * Creates a item
 * @param {Object} item The item details to create
 * @returns {Promise<Object>} Promise that resolves to the created item
 */
exports.create = function (item) {
  if (!item)
    return Promise.reject({ success: false, message: "Bad data provided" });
  return Item.create(item);
};

/**
 * Loads all items
 * @param {Object} query the query object
 * @param {Object} projection projected fields to add/remove
 * @param {Object} sort sorting criteria
 * @returns {Promise<Object>} Promise that resolves to the items list
 */
exports.findAll = function (query = {}, projection = {}, sort = {}) {
  return Item.find(query, projection, sort);
};

/**
 * Loads one item
 * @param {Object} query the query object
 * @param {Object} projection projected fields to add/remove
 * @returns {Promise<Object>} Promise that resolves to the item found
 */
function findOne(query = {}, projection = {}) {
  return Item.findOne(query, projection);
}
exports.findOne = findOne;

exports.getZipCodesAround = function (zipCode, distance = "") {
  return new Promise(async (resolve, reject) => {
    // Some validations
    if (!zipCode) return resolve([]);
    if (!distance) return resolve([zipCode]); // If no distance is provided, we return the zip only.

    // Let's get the zip codes around
    try {
      const headers = {
        "x-rapidapi-host": "redline-redline-zipcode.p.rapidapi.com",
        "x-rapidapi-key": "47eaf9b3eemsh8821c07d555b84cp11d76cjsn3879605d5b16",
      };

      const { data } = await axios.get(
        `https://redline-redline-zipcode.p.rapidapi.com/rest/radius.json/${zipCode}/${distance}/mile`,
        { headers }
      );
      let zipCodes = (data && data.zip_codes) || [];
      zipCodes = zipCodes.map((zCode) => zCode.zip_code);
      if (zipCodes.indexOf(zipCode) === -1) zipCodes.push(zipCode);
      resolve(zipCodes);
    } catch (error) {
      reject(error);
    }
  });
};
