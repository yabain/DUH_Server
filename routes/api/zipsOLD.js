const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/:uid", function (req, res, next) {
  let uid = req.params.uid;
  fetch(
    `redline-redline-zipcode.p.rapidapi.com/rest/info.json/${uid}/degrees`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "redline-redline-zipcode.p.rapidapi.com",
        "x-rapidapi-key": "47eaf9b3eemsh8821c07d555b84cp11d76cjsn3879605d5b16",
      },
    }
  )
    .then((res) =>
      res.status(200).json({
        response: res,
        zip_code: res.zip_code,
        city: res.city,
        state: res.state,
        request: {
          type: "GET",
          description: "Getting Zip Code Information",
          url: "/zips/" + res.zip_code,
        },
      })
    )
    .catch(function (err) {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
