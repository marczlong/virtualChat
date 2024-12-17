const mongoose = require('mongoose');

const ClassifiedSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referencia al modelo User
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Classified', ClassifiedSchema);
