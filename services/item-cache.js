/**
 * Redis utilities for item caching.
 * @author dassiorleando
 */
const Util = require("./util");
const Item = require("../models/Item");
const constant = require("../config/constant");
const redisClient = require("../lib/redis")();

/**
 * Caching saved items
 * @param {Requester~requestCallback} cb The callback that handles the response
 * @returns {void}
 */
exports.saveItems = function (cb = Util.noop) {
  Item.find({}, (error, items) => {
    if (error) return cb(error);
    items.forEach(function (item) {
      // From model to flat object
      saveItem(item);
    });

    cb();
  });
};

/**
 * Caching a single item details
 * @param {Object} item The item details to cache
 * @returns {void}
 */
async function saveItem(item) {
  // Object validation
  if (!item || typeof item !== "object" || !item._id) return;

  item = JSON.parse(JSON.stringify(item));

  // Caching item's ID
  var itemId = item._id;
  await redisClient.saddAsync([constant.ITEMS, itemId]);

  // Explicitly caching the item details
  await redisClient.hmsetAsync("item:" + itemId, Util.objectToArray(item));
}
exports.saveItem = saveItem;

/**
 * Reads a cached item by it's ID.
 * @param {string} itemId The item's to read from cache.
 * @returns {Promise<Object>} Promise that resolves to the targetted item.
 */
exports.readItem = function (itemId) {
  if (!itemId) return Promise.resolve(undefined);
  return redisClient.hgetallAsync("item:" + itemId).then((item) => {
    if (!item) return Promise.resolve(undefined);

    // Fixing fields values
    Object.keys(item).forEach(function (field) {
      try {
        item[field] = JSON.parse(item[field]);
      } catch (error) {}
    });

    return item;
  });
};

/**
 * Getting a chached item field by it's ID.
 * @param {string} itemId The item's to read from cache.
 * @param {string} field The field to get.
 * @returns {Promise<string>} Promise that resolves to the item's field read from the cache.
 */
function readItemField(itemId, field) {
  if (!itemId || !field) return Promise.resolve("");
  return redisClient.hgetAsync("item:" + itemId, field);
}
exports.readItemField = readItemField;

/**
 * Updates a single item field.
 * @param {string} itemId The item's id  to update.
 * @param {string} field The only field to set.
 * @param {string} value The value to set with.
 * @returns {void} It returns nothing.
 */
exports.updatingItemField = function (itemId, field, value) {
  if (!itemId || !field || typeof value === "undefined") return;

  // Caching the item as well
  redisClient.hmset("item:" + itemId, [field, value]);
};

/**
 * Deletes item fields.
 * @param {string} itemId The targetted item.
 * @param {string} fields The fields list to delete.
 * @returns {void} It returns nothing.
 */
function deletingItemFields(itemId, fields = []) {
  if (!itemId) return;
  fields.forEach(function (field) {
    redisClient.hdel("item:" + itemId, field);
  });
}

/**
 * Deletes all the cached items.
 * @param {Requester~requestCallback} cb The callback that handles the response
 * @returns {void}
 */
exports.deleteItems = function (cb = Util.noop) {
  Item.find({}, (error, items) => {
    if (error) return cb(error);

    items.forEach((item) => {
      // Deleting item fields and mappings
      deleteItem(item);
    });
    cb();
  });
};

/**
 * Deletes a single cached item.
 * @param {Object} item The item to delete.
 * @returns {void}
 */
function deleteItem(item) {
  // Object validation
  if (!item || typeof item !== "object" || !item._id) return;

  item = JSON.parse(JSON.stringify(item));

  // Item's ID
  const itemId = item._id;

  // Deleting every item fields
  const itemFields = Object.keys(item);
  deletingItemFields(itemId, itemFields);

  // Removing item Ids index from cached items list
  redisClient.srem([constant.ITEMS, itemId]);
}
exports.deleteItem = deleteItem;

/**
 * Getting the list of cached item Ids
 * @param {Requester~requestCallback} cb The callback that handles the response
 * @returns {Promise<Object[]>} Promise that resolves to the list of cached/saved items
 */
function getItemsIds() {
  return redisClient.smembersAsync(constant.ITEMS);
}
exports.getItemsIds = getItemsIds;

/**
 * Read all the items in batch mode
 * @param {Requester~requestCallback} cb The callback that handles the response
 * @returns {void}
 */
exports.readItems = function () {
  return new Promise(async (resolve, reject) => {
    const itemsIds = (await getItemsIds().catch(Util.error)) || [];

    if (itemsIds && itemsIds.length > 0) {
      const itemsCommands = itemsIds.map((itemId) => [
        "hgetall",
        "item:" + itemId,
      ]);

      redisClient.batch(itemsCommands).exec(function (err, items) {
        if (err) return reject(err);
        resolve(items);
      });
    } else {
      resolve([]);
    }
  });
};
