const express = require('express');
const Kural = require('../models/kural'); // Ensure this path is correct
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// Body parser middleware
router.use(express.json());

// Initialize Google Generative AI with API key
const API_KEY = 'AIzaSyAvbwVKlYfBzPRHspHNnKNYsYDUhCIfO6A';  // Replace with your actual Google API Key
const genAI = new GoogleGenerativeAI(API_KEY);

// Configure the generation parameters
const generationConfig = {
  stopSequences: ["red"],  // Customize stop sequences if necessary
  maxOutputTokens: 100,
  temperature: 0.9,
  topP: 0.1,
  topK: 16,
};

// Initialize the model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Define the initial prompt for Thirukural expert
const initialPrompt = `You are a Thirukural expert. Whenever I ask for a specific Kural or word from the Thirukural, provide the exact verse in Tamil, along with its accurate English translation and a concise, insightful interpretation drawn directly from the wisdom of Thirukural. Additionally, if I ask for a specific word from a Kural, give the word in Tamil, explain its meaning, and its relevance in the context of the Kural. Do not add any extra explanation or unrelated context—just provide the verse in Tamil, translation, interpretation, and relevant word explanation in a clear and precise manner. For example, if I ask for the first Kural, you should give the Tamil verse, its English translation, a brief interpretation, and if I ask for a specific word, provide that word and its explanation from the Kural.
`

// Route to interact with Google Generative AI (Thirukural-based responses)
router.post('/chat', async (req, res) => {
  const userQuery = req.body.query;  // Extract user query from the request

  if (!userQuery || userQuery.trim() === "") {
    return res.status(400).json({ error: "Query is required." });
  }

  try {
    // Make the API call to Google Generative AI model
   

    const result = await model.generateContentStream(
      `${initialPrompt}\nUser: ${userQuery}`, generationConfig
    );

    let chatbotResponse = "";
    // Stream the response and collect the chunks
    for await (const chunk of result.stream) {
      chatbotResponse += chunk.text();
    }

    // Return the chatbot response as a JSON
    res.json({ response: chatbotResponse.trim() });

  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to process the request" });
  }
});

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
router.post('/translate', async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ message: 'Text to translate is required' });
  }

  try {
    // Call Gemini API for translation (replace 'API_KEY' with your actual Gemini API key)
    const response = await axios.post('https://gemini-api.com/translate', {
      api_key: '',
      text: text,
      target_lang: 'ta' // Translate to Tamil
    });

    const translatedText = response.data.translated_text; // Adjust according to Gemini's response format
    res.status(200).json({ translatedText });
  } catch (error) {
    console.error('Error translating text:', error);
    res.status(500).json({ message: 'Error translating text' });
  }
});


router.post('/search', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    console.log('No text provided');
    return res.status(400).json({ message: 'Search text is required' });
  }

  try {
    // Normalize the search text
    const normalizedText = text.trim();

    // Search for the section name in the database
    const results = await Kural.find({
      SectionName: { $regex: normalizedText, $options: 'i' } // Case-insensitive search in SectionName
    });

    if (results.length > 0) {
      console.log(`Found ${results.length} Kurals in the section: "${normalizedText}"`);

      // Send back the list of Kurals (including their Verse) from the matching section
      return res.status(200).json({ results });
    } else {
      return res.status(404).json({ message: 'No matching section found' });
    }

  } catch (error) {
    console.log('Error while searching:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



    

module.exports = router;
