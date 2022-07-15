/**
 * DoUHave singleton MongoDB connection lib.
 * @author dassiorleando
 */
const mongoose = require("mongoose");
const config = require("../config");
const Util = require("../services/util");

/**
 * Connecting to the defined MongoDB server
 * @returns {void}
 */
module.exports = () => {
  global.isDBConnected = false;

  // Database connection
  const db = mongoose.connection;

  // explicit connect
  function connect() {
    mongoose
      .connect(config.MONGODB_URI)
      .then( _=> {
        console.log('Connected to Database ', config.MONGODB_URI);
      })
      .catch(Util.error);
  }

  connect();

  // Connection events
  db.on("connected", function () {
    global.isDBConnected = true;
  });

  db.on("reconnected", function () {});

  db.on("error", function (e) {
    console.error("❌ MongoDB Connection Error: ", e);
    // connect();    // Hack
  });

  db.on("disconnected", function () {
    if (!global.isDBConnected) connect();
    // connect();  // Hack
  });

  // Close the Mongoose connection, when receiving SIGINT
  process.on("SIGINT", function () {
    db.close(function () {
      process.exit(0);
    });
  });

  // Registering all the schemas
  require("../models/User");
  require("../models/Item");
  require("../models/Offer");
  require("../models/Savelist");
  require("../models/UserSession");
};
