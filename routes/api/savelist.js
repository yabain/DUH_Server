const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Item = require("../../models/Item");
const Savelist = require("../../models/Savelist");
const permGuard = require("../middleware/permissions-guard");

//Get All items in Savelist, not really usable
router.get("/", permGuard.check(["USER", "ADMIN"]), (req, res, next) => {
  Savelist.find()
    .select("item quantity _id")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        items: docs.map((doc) => {
          return {
            _id: doc._id,
            item: doc.item,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "/savelist/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//Get Items in Savelist for specific User
router.get("/:userId", permGuard.check(["USER", "ADMIN"]), (req, res, next) => {
  Savelist.find({ savedby1: req.params.userId })
    .select(
      "name _id itemId itemImg budget condition category location locationState submittedby submittedby1 savedby savedby1"
    )
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        items: docs.map((doc) => {
          return {
            name: doc.name,
            budget: doc.budget,
            itemId: doc.itemId,
            itemImg: doc.itemImg,
            _id: doc._id,
            category: doc.category,
            condition: doc.condition,
            location: doc.location,
            locationState: doc.locationState,
            submittedby: doc.submittedby,
            savedby: doc.savedby,
            savedby1: doc.savedby1,
            request: {
              type: "GET",
              url: "/savelist/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//Post item to Savelist
router.post("/", permGuard.check(["USER", "ADMIN"]), (req, res, next) => {
  if (req.body.savedby1 != req.user.userId) {
    return res.status(401).json({
      message: "Auth Failed 5",
    });
  } else {
    Item.findById(req.body.itemId)
      .then(async (item) => {
        if (!item) {
          return res.status(404).json({
            message: "Product not found",
          });
        }
        const newList = new Savelist({
          itemId: req.body.itemId,
          name: req.body.name,
          itemImg: req.body.itemImg,
          budget: req.body.budget,
          category: req.body.category,
          condition: req.body.condition,
          location: req.body.location,
          locationState: req.body.locationState,
          submittedby: req.body.submittedby,
          submittedby1: req.body.submittedby1,
          savedby: req.body.savedby,
          savedby1: req.body.savedby1,
        });
        return newList.save();
      })
      .then((result) => {
        res.status(201).json({
          message: "List Saved",
          createdSavelist: {
            _id: result._id,
            itemId: result.itemId,
            name: result.name,
            itemImg: result.itemImg,
            budget: result.budget,
            category: result.category,
            condition: result.condition,
            location: result.location,
            locationState: result.locationState,
            submittedby: result.submittedby,
            submittedby1: result.submittedby1,
            savedby: result.savedby,
            savedby1: result.savedby1,
          },
          request: {
            type: "POST",
            url: "/savelist/" + result._id,
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
});

//Get Single Item by ID in Savelist
router.get(
  "/:savelistId",
  permGuard.check(["USER", "ADMIN"]),
  (req, res, next) => {
    Savelist.findById(req.params.savelistId)
      .exec()
      .then((savelist) => {
        if (!savelist) {
          return res.status(404).json({
            message: "List Item not found",
          });
        }
        res.status(200).json({
          savelist: savelist,
          request: {
            type: "GET",
            url: "/savelist/" + savelist._id,
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
);

router.patch(
  "/:savelistId",
  permGuard.check(["USER", "ADMIN"]),
  (req, res, next) => {
    res.status(200).json({
      message: "Updated SaveList!",
    });
  }
);

router.delete(
  "/:savelistId",
  permGuard.check(["USER", "ADMIN"]),
  (req, res, next) => {
    Savelist.remove({ _id: req.params.savelistId })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "List Deleted",
          request: {
            type: "DELETE",
            url: "/savelist/",
            body: { itemId: "ID", quantity: "Number" },
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
);

module.exports = router;
