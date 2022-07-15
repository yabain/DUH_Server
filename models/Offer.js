const mongoose = require("mongoose");

const offerSchema = mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  itemOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  submittedAt: { type: Date, default: () => Date.now(), required: true },
  myOffer: { type: Number, required: false },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  contactPhone: { type: String },
  contactEmail: {
    type: String,
    match:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  offerMessage: { type: String, required: false },
  messageSeen: { type: Boolean, required: false, default: false },
  messageReciever: { type: mongoose.Schema.Types.ObjectId },
  accepted: { type: Boolean, default: false },
  roomCreated: { type: Boolean, default: false },
  messageBack: { type: String, default: "" },
});

module.exports = mongoose.model("Offer", offerSchema);
