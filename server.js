require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Import Routes
const authRoutes = require('./routes/auth');
const playerRoutes = require('./routes/player');
const shopRoutes = require('./routes/shop');
const lobbyRoutes = require('./routes/lobby');

// Use Routes
app.use('/auth', authRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/lobby', lobbyRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'MNR-CCC Backend API',
    endpoints: {
      auth: '/auth/discord',
      player: '/api/player/:discordId',
      shop: '/api/shop/buy, /api/shop/sell',
      lobby: '/api/lobby/rooms, /api/lobby/create, /api/lobby/join/:roomId'
    }
  });
});

// WebSocket for PVP (we'll add battle logic later)
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Player ${socket.id} joined room ${roomId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
