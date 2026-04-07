const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Card prices
const CARD_PRICES = {
  princess: 200,
  soch: 200,
  jyll: 200
};

// BUY card
router.post('/buy', async (req, res) => {
  try {
    const { discordId, cardId } = req.body;
    
    const user = await User.findOne({ discordId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const price = CARD_PRICES[cardId];
    if (!price) {
      return res.status(400).json({ error: 'Invalid card' });
    }
    
    if (user.ownedCards.includes(cardId)) {
      return res.status(400).json({ error: 'Already own this card' });
    }
    
    if (user.coins < price) {
      return res.status(400).json({ error: 'Not enough coins' });
    }
    
    user.coins -= price;
    user.ownedCards.push(cardId);
    await user.save();
    
    res.json({
      coins: user.coins,
      ownedCards: user.ownedCards,
      message: 'Card purchased successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SELL card
router.post('/sell', async (req, res) => {
  try {
    const { discordId, cardId } = req.body;
    
    const user = await User.findOne({ discordId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.ownedCards.includes(cardId)) {
      return res.status(400).json({ error: 'Do not own this card' });
    }
    
    if (user.ownedCards.length <= 3) {
      return res.status(400).json({ error: 'Must have at least 3 cards' });
    }
    
    const price = CARD_PRICES[cardId] || 0;
    const sellPrice = Math.floor(price / 2);
    
    user.coins += sellPrice;
    user.ownedCards = user.ownedCards.filter(id => id !== cardId);
    await user.save();
    
    res.json({
      coins: user.coins,
      ownedCards: user.ownedCards,
      message: 'Card sold successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
