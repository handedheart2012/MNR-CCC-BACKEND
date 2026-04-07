const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');

// Discord OAuth URLs
const DISCORD_API = 'https://discord.com/api/v10';
const OAUTH_URL = `${DISCORD_API}/oauth2/authorize`;
const TOKEN_URL = `${DISCORD_API}/oauth2/token`;

// Redirect to Discord login
router.get('/discord', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify'
  });
  
  res.redirect(`${OAUTH_URL}?${params}`);
});

// Discord callback
router.get('/discord/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }
  
  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(TOKEN_URL, new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    const { access_token } = tokenResponse.data;
    
    // Get user info from Discord
    const userResponse = await axios.get(`${DISCORD_API}/users/@me`, {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    
    const discordUser = userResponse.data;
    
    // Find or create user in database
    let user = await User.findOne({ discordId: discordUser.id });
    
    if (!user) {
      user = new User({
        discordId: discordUser.id,
        username: discordUser.username
      });
      await user.save();
    } else {
      user.username = discordUser.username;
      user.lastLogin = new Date();
      await user.save();
    }
    
    // Redirect to frontend with user data
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendURL}?discordId=${user.discordId}&username=${user.username}`);
    
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const { discordId } = req.query;
    
    if (!discordId) {
      return res.status(400).json({ error: 'No discordId provided' });
    }
    
    const user = await User.findOne({ discordId });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      discordId: user.discordId,
      username: user.username,
      coins: user.coins,
      ownedCards: user.ownedCards,
      savedTeam: user.savedTeam,
      cardUpgrades: Object.fromEntries(user.cardUpgrades)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
