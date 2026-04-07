const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  hostId: {
    type: String,
    required: true
  },
  hostUsername: {
    type: String,
    required: true
  },
  guestId: {
    type: String,
    default: null
  },
  guestUsername: {
    type: String,
    default: null
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['waiting', 'in_progress', 'finished'],
    default: 'waiting'
  },
  spectators: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Room', roomSchema);
