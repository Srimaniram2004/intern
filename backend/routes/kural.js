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

// Route to search for Kurals (POST)
// router.post('/search', async (req, res) => {
//   try {
//     const { text } = req.body; // Extract search text from request body

//     if (!text || typeof text !== 'string') {
//       return res.status(400).json({ message: 'Search text is required and must be a string' });
//     }

//     // Normalize the search text
//     const normalizedText = text.trim().replace(/\s+/g, ' '); // Normalize search text
//     console.log(`Searching for: ${normalizedText}`);

//     // Perform the search query with regex
//     // const results = await Kural.findOne({
//     //   $or: [
//     //     { Verse: { $regex: normalizedText, $options: 'i' } },
//     //     { Explanation: { $regex: normalizedText, $options: 'i' } },
//     //     { Translation: { $regex: normalizedText, $options: 'i' } },
//     //   ],
//     // });
//     const results = await Kural.find( { Verse: { $eq: normalizedText } } )


//     console.log('Found results:', results.length);

//     // if (results.length === 0) {
//     //   return res.status(404).json({ message: 'No matching Kurals found' });
//     // }

//     // res.status(200).json({ results });

//   } catch (err) {
//     console.error('Error searching for Kurals:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


router.post('/search', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    console.log('No text provided');
    return res.status(400).json({ message: 'Search text is required' });
  }

  try {
    // Split the input sentence into individual words
    const words = text.trim().split(/\s+/); // Split by spaces
    let searchResults = [];

    // Loop through each word and search in the database
    for (let word of words) {
      const result = await Kural.findOne({
        Verse: { $regex: word, $options: 'i' }, // Use regex for case-insensitive search
      });

      if (result) {
        console.log(`Found matching verse for word: "${word}"`);
        searchResults.push(result);
      } else {
        console.log(`No matching verse found for word: "${word}"`);
      }
    }

    // If any results are found, send them back as response
    if (searchResults.length > 0) {
      return res.status(200).json({ results: searchResults });
    } else {
      return res.status(404).json({ message: 'No matching verses found' });
    }

  } catch (error) {
    console.log('Error while searching:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
