const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// GET all available rooms
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find({ 
      status: 'waiting',
      isPrivate: false 
    }).sort({ createdAt: -1 });
    
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new room
router.post('/create', async (req, res) => {
  try {
    const { name, hostId, hostUsername, isPrivate } = req.body;
    
    const room = new Room({
      name,
      hostId,
      hostUsername,
      isPrivate: isPrivate || false
    });
    
    await room.save();
    
    res.json({
      roomId: room._id,
      message: 'Room created successfully',
      room
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// JOIN room
router.post('/join/:roomId', async (req, res) => {
  try {
    const { guestId, guestUsername } = req.body;
    
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    if (room.status !== 'waiting') {
      return res.status(400).json({ error: 'Room is not available' });
    }
    
    if (room.guestId) {
      return res.status(400).json({ error: 'Room is full' });
    }
    
    room.guestId = guestId;
    room.guestUsername = guestUsername;
    room.status = 'in_progress';
    await room.save();
    
    res.json({
      message: 'Joined room successfully',
      room
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LEAVE/DELETE room
router.delete('/:roomId', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.roomId);
    res.json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
