const mongoose = require('mongoose');

const FictionalCharacterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  personality: { type: String, required: true },
  role: { type: String, required: true },
  interactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Referencia a usuarios con los que interactúan
});

module.exports = mongoose.model('FictionalCharacter', FictionalCharacterSchema);
