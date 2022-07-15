/**
 * Redis utilities for offer caching.
 * @author dassiorleando
 */
const Util = require("./util");
const Offer = require("../models/Offer");
const constant = require("../config/constant");
const redisClient = require("../lib/redis")();

/**
 * Caching saved offers
 * @param {Requester~requestCallback} cb The callback that handles the response
 * @returns {void}
 */
exports.saveOffers = function (cb = Util.noop) {
  Offer.find({}, (error, offers) => {
    if (error) return cb(error);

    offers.forEach(function (offer) {
      // From model to flat object
      saveOffer(offer);
    });

    cb();
  });
};

/**
 * Caching a single offer details
 * @param {Object} offer The offer details to cache
 * @returns {void}
 */
async function saveOffer(offer) {
  // Object validation
  if (!offer || typeof offer !== "object" || !offer._id) return;

  offer = JSON.parse(JSON.stringify(offer));

  // Caching offer's ID
  var offerId = offer._id;
  await redisClient.saddAsync([constant.OFFERS, offerId]);

  // Explicitly caching the offer details
  await redisClient.hmsetAsync("offer:" + offerId, Util.objectToArray(offer));

  // const keys = await redisClient.keysAsync('*');
}
exports.saveOffer = saveOffer;

/**
 * Reads a cached offer by it's ID.
 * @param {string} offerId The offer's to read from cache.
 * @returns {Promise<Object>} Promise that resolves to the targetted offer.
 */
exports.readOffer = function (offerId) {
  if (!offerId) return Promise.resolve(undefined);
  return redisClient.hgetallAsync("offer:" + offerId).then((offer) => {
    if (!offer) return Promise.resolve(undefined);

    // Fixing fields values
    Object.keys(offer).forEach(function (field) {
      try {
        offer[field] = JSON.parse(offer[field]);
      } catch (error) {}
    });

    return offer;
  });
};

/**
 * Getting a chached offer field by it's ID.
 * @param {string} offerId The offer's to read from cache.
 * @param {string} field The field to get.
 * @returns {Promise<string>} Promise that resolves to the offer's field read from the cache.
 */
function readOfferField(offerId, field) {
  if (!offerId || !field) return Promise.resolve("");
  return redisClient.hgetAsync("offer:" + offerId, field);
}
exports.readOfferField = readOfferField;

/**
 * Updates a single offer field.
 * @param {string} offerId The offer's id  to update.
 * @param {string} field The only field to set.
 * @param {string} value The value to set with.
 * @returns {void} It returns nothing.
 */
exports.updatingOfferField = function (offerId, field, value) {
  if (!offerId || !field || typeof value === "undefined") return;

  // Caching the offer as well
  redisClient.hmset("offer:" + offerId, [field, value]);
};

/**
 * Deletes offer fields.
 * @param {string} offerId The targetted offer.
 * @param {string} fields The fields list to delete.
 * @returns {void} It returns nothing.
 */
function deletingOfferFields(offerId, fields = []) {
  if (!offerId) return;
  fields.forEach(function (field) {
    redisClient.hdel("offer:" + offerId, field);
  });
}

/**
 * Deletes all the cached offers.
 * @param {Requester~requestCallback} cb The callback that handles the response
 * @returns {void}
 */
exports.deleteOffers = function (cb = Util.noop) {
  Offer.find({}, (error, offers) => {
    if (error) return cb(error);

    offers.forEach((offer) => {
      // Deleting offer fields and mappings
      deleteOffer(offer);
    });

    cb();
  });
};

/**
 * Deletes a single cached offer.
 * @param {Object} offer The offer to delete.
 * @returns {void}
 */
function deleteOffer(offer) {
  // Object validation
  if (!offer || typeof offer !== "object" || !offer._id) return;

  offer = JSON.parse(JSON.stringify(offer));

  // Offer's ID
  const offerId = offer._id;

  // Deleting every offer fields
  const offerFields = Object.keys(offer);
  deletingOfferFields(offerId, offerFields);

  // Removing offer Ids index from cached offers list
  redisClient.srem([constant.OFFERS, offerId]);
}
exports.deleteOffer = deleteOffer;

/**
 * Getting the list of cached offer Ids
 * @param {Requester~requestCallback} cb The callback that handles the response
 * @returns {Promise<Object[]>} Promise that resolves to the list of cached/saved offers
 */
function getOffersIds() {
  return redisClient.smembersAsync(constant.OFFERS);
}
exports.getOffersIds = getOffersIds;

/**
 * Read all the offers in batch mode
 * @param {Requester~requestCallback} cb The callback that handles the response
 * @returns {void}
 */
exports.readOffers = function () {
  return new Promise(async (resolve, reject) => {
    const offersIds = (await getOffersIds().catch(Util.error)) || [];

    if (offersIds && offersIds.length > 0) {
      const offersCommands = offersIds.map((offerId) => [
        "hgetall",
        "offer:" + offerId,
      ]);

      redisClient.batch(offersCommands).exec(function (err, offers) {
        if (err) return reject(err);
        resolve(offers);
      });
    } else {
      resolve([]);
    }
  });
};
