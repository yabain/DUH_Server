const mongoose = require('mongoose');

const savelistSchema = mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  name: { type: String, default: '', required: true },
  itemImg: { type: String, default: '', required: true },
  budget: { type: Number, required: true },
  category: { type: String, default: '', required: true },
  condition: { type: String, default: '', required: true },
  location: { type: String, default: '', required: true },
  locationState: { type: String, default: '', required: true },
  submittedby: { type: String, default: '', required: true },
  submittedby1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  savedby: { type: String, default: '', required: true },
  savedby1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quantity: { type: Number, default: 1, required: true }
});

module.exports = mongoose.model('Savelist', savelistSchema);
