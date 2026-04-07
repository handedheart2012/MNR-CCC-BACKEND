const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  coins: {
    type: Number,
    default: 500
  },
  ownedCards: {
    type: [String],
    default: ['mom', 'tag', 'chief']
  },
  savedTeam: {
    type: [String],
    default: []
  },
  cardUpgrades: {
    type: Map,
    of: Number,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
