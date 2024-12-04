const express = require('express');
const Kural = require('../models/kural'); // Ensure this path is correct

const router = express.Router();

// Function to calculate the day of the year
const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff =
    now - start +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

// Route to get the daily Kural
router.get('/daily-kural', async (req, res) => {
  try {
    // Count total number of Kurals in the database
    const totalKurals = await Kural.countDocuments();

    if (totalKurals === 0) {
      return res.status(404).json({ message: 'No Kurals found in the database' });
    }

    // Calculate the Kural index for the day
    const dayOfYear = getDayOfYear();
    const kuralIndex = dayOfYear % totalKurals; // Loop through Kurals cyclically

    // Fetch the Kural based on the index
    const kural = await Kural.findOne().skip(kuralIndex);

    if (!kural) {
      return res.status(404).json({ message: 'No Kural found for today' });
    }

    res.status(200).json(kural);
  } catch (err) {
    console.error('Error fetching daily Kural:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
