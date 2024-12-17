const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  walletBalance: { type: Number, default: 1000 },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Referencia a otros usuarios
});

module.exports = mongoose.model('User', UserSchema);
