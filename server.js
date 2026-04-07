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

// Routes (we'll add these next)
app.get('/', (req, res) => {
  res.json({ message: 'MNR-CCC Backend API' });
});

// WebSocket for PVP (we'll add logic later)
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
server​​​​​​​​​​​​​​​​
