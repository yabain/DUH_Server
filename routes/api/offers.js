const express = require("express");
const router = express.Router();
const config = require("../../config");
const Dynamo = require("../../services/Dynamo");
const Util = require("../../services/util");
const itemService = require("../../services/item");
const offerService = require("../../services/offer");
const permGuard = require("../middleware/permissions-guard");
const offerCacheService = require("../../services/offer-cache");

const Offer = require("../../models/Offer");

//Route to get All Offers for Item
router.get(
  "/item/:itemId",
  permGuard.check(["USER", "ADMIN"]),
  (req, res, next) => {
    // The current user's id
    const submitter = req.user._id || req.user.userId;

    // Getting the offer submitted for the current user or not
    const forUser = req.query.forUser || "0";
    const query = { itemId: req.params.itemId };
    if (forUser !== "0") query.submittedBy = submitter;

    Offer.find(query)
      .sort({ submittedAt: -1 })
      .select(
        "_id itemId itemOwner submittedAt myOffer submittedBy contactPhone contactEmail offerMessage accepted messageBack"
      )
      .populate("itemId", "createdAt condition")
      .populate("itemOwner", "userName firstName lastName email")
      .populate("submittedBy", "userName firstName lastName email")
      .exec()
      .then((docs) => {
        const response = {
          count: docs.length,
          items: docs.map((doc) => {
            return {
              _id: doc._id,
              itemId: doc.itemId,
              itemOwner: doc.itemOwner,
              submittedAt: doc.submittedAt,
              myOffer: doc.myOffer,
              submittedBy: doc.submittedBy,
              contactPhone: doc.contactPhone,
              contactEmail: doc.contactEmail,
              offerMessage: doc.offerMassage,
              accepted: doc.accepted,
              messageBack: doc.messageBack,
              request: {
                type: "GET",
                url: "/offers/item/" + doc.itemId,
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
  }
);

//Route to get Offers of all Items posted by User who Posted Item
router.get(
  "/itemowner/:userId",
  permGuard.check(["USER", "ADMIN"]),
  async (req, res, next) => {
    try {
      let offer = await Offer.find({
        $and: [{ messageReciever: req.params.userId }, { messageSeen: false }],
      });

      res.status(200).json({ count: offer.length });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

//Route to get All Offers by User who submitted them on single Item???
//Better: Check if User has already put offer on item
router.get(
  "/check/:itemId/:userId",
  permGuard.check(["USER", "ADMIN"]),
  (req, res, next) => {
    Offer.find({ itemId: req.params.itemId, submittedBy: req.params.userId })
      .select("_id itemId submittedBy")
      .exec()
      .then((docs) => {
        if (docs.length === 0) {
          res.status(200).json({ success: false });
        } else {
          res.status(200).json({ success: true });
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
);

/**
 * Route to get offers submitted by a user
 * We can provide the loadItemsOnly (o or any other value), to get only the items list, if it's 0 we'll load the user offers
 */
router.get(
  "/myoffers/:userId",
  permGuard.check(["USER", "ADMIN"]),
  (req, res) => {
    // TODO: better security for the userId and req.user

    // The current user's id
    // const userId = req.user._id || req.user.userId;

    // Get only the items or not
    const loadItemsOnly = req.query.loadItemsOnly || 0;

    Offer.find({ submittedBy: req.params.userId })
      .select(
        "_id itemId itemOwner submittedAt myOffer submittedBy contactPhone contactEmail offerMessage accepted messageBack"
      )
      .populate(
        "itemId",
        "name itemImg budget category condition description location locationState submittedby submittedby1 createdAt"
      )
      .exec()
      .then((docs) => {
        const response = {
          count: docs.length,
          items: docs.map((doc) => {
            if (loadItemsOnly != 0) return doc.itemId;
            return {
              _id: doc._id,
              itemId: doc.itemId._id,
              itemOwner: doc.itemOwner,
              submittedAt: doc.submittedAt,
              myOffer: doc.myOffer,
              submittedBy: doc.submittedBy,
              contactPhone: doc.contactPhone,
              contactEmail: doc.contactEmail,
              offerMessage: doc.offerMassage,
              accepted: doc.accepted,
              messageBack: doc.messageBack,
              request: {
                type: "GET",
                url: "/offers/myoffers/" + doc.submittedBy,
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
  }
);

// Route to post Offer on an Item
router.post("/", permGuard.check(["USER", "ADMIN"]), async (req, res, next) => {
  const itemId = req.body.itemId;
  if (!itemId)
    return res
      .status(400)
      .json({ success: false, message: "Invalid item id provided!" });

  // Getting the targetted item
  const item = await itemService.findById(itemId);
  if (!item)
    return res.status(404).json({ success: false, message: "Item not found!" });

  // The current user's id
  const submitter = req.user._id || req.user.userId;

  // The owner shouldn't submit an offer on his posts
  if (item.submittedby1.toString() === submitter)
    return res.status(400).json({
      success: false,
      message: "You can not submit an offer on your own posts!",
    });

  // Check if the user already submitted an offer for this item
  const existingOffer = await offerService.findOne({
    itemId: itemId,
    submittedBy: submitter,
  });
  console.log(existingOffer, "existingOffer");
  if (existingOffer)
    return res.status(400).json({
      success: false,
      message: "Already submitted an offer for this item!",
    });

  const offer = {
    itemId: itemId,
    itemOwner: item.submittedby1,
    myOffer: req.body.myOffer,
    submittedBy: submitter,
    messageReciever: item.submittedby1,
    // contactPhone: req.body.contactPhone,
    // contactEmail: req.body.contactEmail,
    offerMessage: req.body.offerMessage,
  };

  const savedOffer = await offerService.create(offer);

  // Caching the saved offer
  await offerCacheService.saveOffer(savedOffer.toObject()).catch();

  // Offer saved successfully, let's save the room and message in DynamoDB

  const roomId = `${savedOffer.itemOwner}_${savedOffer._id}_${savedOffer.submittedBy}`;
  const roomData = {
    ID: roomId,
    date: Date.now(),
    itemId: savedOffer.itemId.toString(),
    itemOwner: savedOffer.itemOwner.toString(),
    submittedBy: savedOffer.submittedBy.toString(),
  };
  await Dynamo.write(roomData, config.USER_ROOMS_TABLE);

  // Linking the roomd id with the offer
  savedOffer.roomCreated = true;
  savedOffer.save();

  // Let's save the first message
  if (req.body.offerMessage) {
    const messageData = {
      ID: Util.generateUUID(),
      date: Date.now(),
      roomId: roomId,
      from: savedOffer.submittedBy.toString(),
      to: savedOffer.itemOwner.toString(),
      message: req.body.offerMessage,
    };
    await Dynamo.write(messageData, config.USER_MESSAGES_TABLE);

    // Saving the last message as well
    messageData.ID = `${roomId}_last`;
    await Dynamo.write(messageData, config.ROOM_LAST_MESSAGES_TABLE);
  } else {
  }

  res.status(201).json({
    success: true,
    message: "Offer Sent",
    createdItem: {
      itemId: savedOffer.itemId,
      myOffer: savedOffer.myOffer,
      submittedBy: { _id: savedOffer.submittedBy },
      itemOwner: { _id: savedOffer.itemOwner },
      contactPhone: savedOffer.contactPhone,
      contactEmail: savedOffer.contactEmail,
      offerMessage: savedOffer.offerMessage,
      roomCreated: savedOffer.roomCreated,
      request: {
        type: "POST",
        url: "/offers/" + savedOffer._id,
      },
    },
  });
});

//Route to post Message Back to Offerer, or make changes to offer
router.patch(
  "/offer/:offerId",
  permGuard.check(["USER", "ADMIN"]),
  (req, res, next) => {
    const id = req.params.offerId;
    Offer.update({ _id: id }, { $set: { messageSeen: true } })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "Item updated",
          request: {
            type: "PATCH",
            url: "/offers/offer/" + id,
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

//Route to Delete Offer
router.delete(
  "/offer/:offerId",
  permGuard.check(["USER", "ADMIN"]),
  (req, res, next) => {
    const id = req.params.offerId;
    Offer.remove({ _id: id })
      .exec()
      .then(async (result) => {
        await Dynamo.delete(connectionId, config.USER_ROOMS_TABLE);
        res.status(200).json({
          message: "Offer Deleted!",
          request: {
            type: "DELETE",
            url: "/offers/offer",
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
