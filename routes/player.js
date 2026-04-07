const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET player data
router.get('/:discordId', async (req, res) => {
  try {
    const user = await User.findOne({ discordId: req.params.discordId });
    
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

// UPDATE player coins
router.put('/:discordId/coins', async (req, res) => {
  try {
    const { coins } = req.body;
    
    const user = await User.findOneAndUpdate(
      { discordId: req.params.discordId },
      { coins: coins },
      { new: true }
    );
    
    res.json({ coins: user.coins });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE player team
router.put('/:discordId/team', async (req, res) => {
  try {
    const { savedTeam } = req.body;
    
    const user = await User.findOneAndUpdate(
      { discordId: req.params.discordId },
      { savedTeam: savedTeam },
      { new: true }
    );
    
    res.json({ savedTeam: user.savedTeam });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE card upgrades
router.put('/:discordId/upgrades', async (req, res) => {
  try {
    const { cardUpgrades } = req.body;
    
    const user = await User.findOneAndUpdate(
      { discordId: req.params.discordId },
      { cardUpgrades: cardUpgrades },
      { new: true }
    );
    
    res.json({ cardUpgrades: Object.fromEntries(user.cardUpgrades) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
