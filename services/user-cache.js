/**
 * Redis utilities for user caching.
 * @author dassiorleando
 */
const Util = require("./util");
const User = require("../models/User");
const constant = require("../config/constant");
const redisClient = require("../lib/redis")();

/**
 * Caching saved users
 * @param {Requester~requestCallback} cb The callback that handles the response
 * @returns {void}
 */
exports.saveUsers = function (cb = Util.noop) {
  User.find({}, (error, users) => {
    if (error) return cb(error);

    users.forEach(function (user) {
      // From model to flat object
      saveUser(user);
    });

    cb();
  });
};

/**
 * Caching a single user details
 * @param {Object} user The user details to cache
 * @returns {void}
 */
async function saveUser(user) {
  // Object validation
  if (!user || typeof user !== "object" || !user._id) return;

  user = JSON.parse(JSON.stringify(user));

  // Removing some sensible fields.
  delete user.password;

  // Caching user's ID
  var userId = user._id;
  await redisClient.saddAsync([constant.USERS, userId]);

  // Explicitly caching the user details
  await redisClient.hmsetAsync("user:" + userId, Util.objectToArray(user));
}
exports.saveUser = saveUser;

/**
 * Reads a cached user by it's ID.
 * @param {string} userId The user's to read from cache.
 * @returns {Promise<Object>} Promise that resolves to the targetted user.
 */
exports.readUser = function (userId) {
  if (!userId) return Promise.resolve(undefined);
  return redisClient.hgetallAsync("user:" + userId).then((user) => {
    if (!user) return Promise.resolve(undefined);

    // Fixing fields values
    Object.keys(user).forEach(function (field) {
      try {
        user[field] = JSON.parse(user[field]);
      } catch (error) {}
    });

    // Arrays are stored as string like "['a', 'b', 'c']"
    user.permissions = eval(user.permissions);

    delete user.password;

    return user;
  });
};

/**
 * Getting a chached user field by it's ID.
 * @param {string} userId The user's to read from cache.
 * @param {string} field The field to get.
 * @returns {Promise<string>} Promise that resolves to the user's field read from the cache.
 */
function readUserField(userId, field) {
  if (!userId || !field) return Promise.resolve("");
  return redisClient.hgetAsync("user:" + userId, field);
}
exports.readUserField = readUserField;

/**
 * Updates a single user field.
 * @param {string} userId The user's id  to update.
 * @param {string} field The only field to set.
 * @param {string} value The value to set with.
 * @returns {void} It returns nothing.
 */
exports.updatingUserField = function (userId, field, value) {
  if (!userId || !field || typeof value === "undefined") return;

  // Caching the user as well
  redisClient.hmset("user:" + userId, [field, value]);
};

/**
 * Deletes user fields.
 * @param {string} userId The targetted user.
 * @param {string} fields The fields list to delete.
 * @returns {void} It returns nothing.
 */
function deletingUserFields(userId, fields = []) {
  if (!userId) return;
  fields.forEach(function (field) {
    redisClient.hdel("user:" + userId, field);
  });
}

/**
 * Deletes all the cached users.
 * @param {Requester~requestCallback} cb The callback that handles the response
 * @returns {void}
 */
exports.deleteUsers = function (cb = Util.noop) {
  User.find({}, (error, users) => {
    if (error) return cb(error);

    users.forEach((user) => {
      // Deleting user fields and mappings
      deleteUser(user);
    });

    cb();
  });
};

/**
 * Deletes a single cached user.
 * @param {Object} user The user to delete.
 * @returns {void}
 */
function deleteUser(user) {
  // Object validation
  if (!user || typeof user !== "object" || !user._id) return;

  user = JSON.parse(JSON.stringify(user));

  // User's ID
  const userId = user._id;

  // Deleting every user fields
  const userFields = Object.keys(user).concat(constant.USER_EXTRA_FIELDS);
  deletingUserFields(userId, userFields);

  // Removing user Ids index from cached users list
  redisClient.srem([constant.USERS, userId]);
}
exports.deleteUser = deleteUser;

/**
 * Getting the list of cached user Ids
 * @param {Requester~requestCallback} cb The callback that handles the response
 * @returns {Promise<Object[]>} Promise that resolves to the list of cached/saved users
 */
function getUsersIds() {
  return redisClient.smembersAsync(constant.USERS);
}
exports.getUsersIds = getUsersIds;

/**
 * Read all the users in batch mode
 * @param {Requester~requestCallback} cb The callback that handles the response
 * @returns {void}
 */
exports.readUsers = function () {
  return new Promise(async (resolve, reject) => {
    const usersIds = (await getUsersIds().catch(Util.error)) || [];

    if (usersIds && usersIds.length > 0) {
      const usersCommands = usersIds.map((userId) => [
        "hgetall",
        "user:" + userId,
      ]);

      redisClient.batch(usersCommands).exec(function (err, users) {
        if (err) return reject(err);
        resolve(users);
      });
    } else {
      resolve([]);
    }
  });
};

/**
 * Read all the users emails.
 * @param {Requester~requestCallback} cb The callback that handles the response
 * @returns {void}
 */
exports.readUsersEmails = function (cb = Util.noop) {
  return new Promise(async (resolve, reject) => {
    const usersIds = (await getUsersIds().catch(Util.error)) || [];
    if (usersIds && usersIds.length > 0) {
      const emailsCommands = usersIds.map((userId) => [
        "hget",
        "user:" + userId,
        "email",
      ]);

      redisClient.batch(emailsCommands).exec(function (err, emails) {
        if (err) return reject(err);
        resolve(emails);
      });
    } else {
      resolve([]);
    }
  });
};
