const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/:uid", (req, res, next) => {
  let uid = req.params.uid;
  return fetch(
    `redline-redline-zipcode.p.rapidapi.com/rest/info.json/${uid}/degrees`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "redline-redline-zipcode.p.rapidapi.com",
        "x-rapidapi-key": "47eaf9b3eemsh8821c07d555b84cp11d76cjsn3879605d5b16",
      },
    }
  )
    .then((res) => {
      return res.json();
    })
    .catch(function (err) {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
