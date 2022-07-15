const http = require('http');
const config = require('./config');
const fs = require('fs');
const db = require("./lib/db")();

const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const mongoose = require("mongoose");
const compression = require("compression");
const Util = require("./services/util");
const morgan = require("morgan");
const path = require("path");
const request = require("request");
const URL = require("url").URL;
const urlPreview = require("./services/urlPreview");
const userService = require("./services/user");
const userRoutes = require("./routes/api/user");
const itemRoutes = require("./routes/api/items");
const savelistRoutes = require("./routes/api/savelist");
const offerRoutes = require("./routes/api/offers");
const zipRoutes = require("./routes/api/zips");
const cors = require("cors");

// JWT security checker
const checkAuth = require("./routes/middleware/check-auth");
const itemCacheService = require("./services/item-cache");

const app = express();

// Enable CORS
// allowed servers
// var whitelist = process.env.WEB_URL.split(',');
var whitelist = [];

// local envs can only connect to dev    
if (process.env.NODE_ENV=='dev' || process.env.NODE_ENV=='local') {
    whitelist.push('http://localhost:3000');
    whitelist.push('http://192.168.1.24:3000');
    whitelist.push('http://192.168.1.100:3000');
}

var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
    //Credentials are cookies, authorization headers or TLS client certificates.
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept', 'token', 'nonce']
};
console.log(`*** CORS is ACTIVE FOR: ${JSON.stringify(whitelist)}`);
app.use(cors(corsOptions));

//Required Middleware
app.use(morgan("dev"));
app.use("/itempics", express.static("itempics"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(compression());
app.disable("x-powered-by");

// Use routes
// app.use('<URL>', <variable> );
//app.use('/', app);
app.use("/user", checkAuth.secure(false), userRoutes);
app.use("/items", checkAuth.secure(false), itemRoutes);
app.use("/savelist", checkAuth.secure(true), savelistRoutes);
app.use("/offers", checkAuth.secure(true), offerRoutes);
app.use("/zips", zipRoutes);

const indexPath = path.join(__dirname, "public/build/index.html");
const douhaveLogo =
  "https://douhave-files.s3.us-east-2.amazonaws.com/Primary+Logo/Primary+Logo-+Off+Black.png";

/**
 * Parse a link to know its SEO data.
 */
// app.get('/parseLink', checkAuth.secure(true), async (req, res) => {
app.get("/parseLink", async (req, res) => {
  // The link to parse
  let link = req.query.url;

  try {
    // Be sure it's a valid link
    new URL(link);
    link = link.replace(/\/$/, ""); // Removes the trailing slash.

    // If it's an image we resolve directly
    request.head(link, async (error, response) => {
      const contentType = response && response.headers["content-type"];
      if (contentType && contentType.indexOf("image/") !== -1) {
        res.json({ img: link, isImage: true });
      } else {
        const previewData = await urlPreview(link);
        res.status(200).json(previewData);
      }
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid link provided." });
  }
});

/**
 * Home page route
 */
app.get("/", (req, res) => {
    res.end(`DoUHave API ${ process.env.NODE_ENV } Server v${process.env.DOUHAVE_SERVER_VERSION}`);
});

/**
 * Home page route
 */
 app.get("/favicon.ico", express.static('favicon.ico'));

/**
 * Home page route
 */
app.get("/confirmEmail/:userId", async (req, res) => {
  // Performing the database change
  const userConfirmed = await userService.confirmUserEmail(req.params.userId);
  if (!userConfirmed && !userConfirmed._id) {
    return res
      .status(404)
      .json({ success: false, message: "Unknown or deleted account." });
  }

  // Redirect to the email confirmation success page
  res.redirect(`${config.WEB_URL}/email-confirmed`);
});

app.get("/item/:itemId", async (req, res) => {
  const itemId = req.params.itemId;

  if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ success: false, message: "Invalid item id" });
  }

  // Looking for the item
  const item =
    (await itemCacheService.readItem(itemId).catch(Util.error)) || {};

  fs.readFile(indexPath, "utf8", function (err, data) {
    if (err) {
      return 0;
    }
    let itemImg = "";
    if (item && item.itemImg) {
      itemImg = item.itemImg.startsWith("http")
        ? item.itemImg
        : `${config.SERVER_URL}${item.itemImg.substring(
            item.itemImg.lastIndexOf("/") - 17,
            item.itemImg.length
          )}`;
    }

    data = data.replace(/\$OG_TITLE/g, item.name || "Item Details");
    data = data.replace(
      /\$OG_DESCRIPTION/g,
      item.description || "Item Description"
    );
    if (itemImg) {
      data = data.replace(/\$OG_IMAGE/g, itemImg);
    }
    res.send(data);
  });
});

//Error Handling
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Middleware for handling express-jwt-permissions and unhandled errors
router.use(function (err, req, res, next) {
  if (err.code === "invalid_token") {
    res.status(401).send("Invalid token!");
  } else if (
    err.code === "permission_denied" ||
    err.code === "permissions_invalid" ||
    err.name === "UnauthorizedError"
  ) {
    res.status(403).send("Not allowed !");
  } else if (
    err.code === "user_object_not_found" ||
    err.code === "permissions_not_found" ||
    err.code === "request_property_undefined" ||
    err.code === "credentials_required"
  ) {
    res.status(403).send("Access Denied !");
  } else if (err.code === "LIMIT_FILE_SIZE") {
    res.status(400).send("The file uploaded is big.");
  } else {
    // Catch up unhandled errors
    Util.error(err);
    res
      .status(err.status || 400)
      .json({ success: false, message: Util.getErrorMessage(err) });
  }
});

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

server.listen(config.PORT,"192.168.1.11", _=> {
  // *** CHANGE THE VERSION IN version.txt ***
  fs.readFile('version.txt', (err, data) => {
    if (err) throw err;
    process.env.DOUHAVE_SERVER_VERSION = data;
    console.log(`DoUHave Server v${ process.env.DOUHAVE_SERVER_VERSION }\r\nListening on port ${ config.PORT }`);
  });
});


