const express = require('express');
const Kural = require('../models/kural'); // Ensure this path is correct

const router = express.Router();

// Route to get the daily Kural
router.get('/daily-kural', async (req, res) => {
  try {
    // Find the most recent Kural
    const kural = await Kural.findOne().sort({ Date: -1 });

    if (!kural) {
      return res.status(404).json({ message: 'No Kural found' });
    }

    res.status(200).json(kural);
  } catch (err) {
    console.error('Error fetching daily Kural:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
