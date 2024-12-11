// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const readline = require("readline");

// // Initialize API key and configuration
// const API_KEY = `AIzaSyAvbwVKlYfBzPRHspHNnKNYsYDUhCIfO6A`; // Replace with your API key
// const genAI = new GoogleGenerativeAI(API_KEY);

// const generationConfig = {
//   stopSequences: ["red"],
//   maxOutputTokens: 100,
//   temperature: 0.9,
//   topP: 0.1,
//   topK: 16,
// };

// // Set up readline for dynamic user input
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// // Initialize the model
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const initialPrompt = `From now on, you are a Thirukural expert. Whenever I ask you a question related to Thirukural, provide precise and insightful responses that are directly drawn from the wisdom of Thirukural. Your answers should be aligned with the teachings, values, and moral principles found in the Thirukural. Please ensure that your explanations and interpretations are clear, concise, and rooted in the authentic meaning of each Kural. Do not deviate from the text and avoid adding any unnecessary context—just provide the most relevant, accurate, and profound insights based on Thirukural.`;

// (async () => {
//   try 
//   {
//     console.log("thirukural bot is ready to assist you. Ask your questions!");

//     // Function to handle user queries
//     const handleQuery = async (query) => {
//       console.log("\nthirukural bot is thinking...\n");
//       const result = await model.generateContentStream(
//         `${initialPrompt}\nUser: ${query}`,
//         generationConfig
//       );

//       // Stream the response
//       for await (const chunk of result.stream) {
//         process.stdout.write(chunk.text());
//       }
//       console.log("\n"); // Add spacing after the bot's response
//       askUser(); // Prompt for the next question
//     };

//     // Function to prompt user input
//     const askUser = () => {
//       rl.question("You: ", (query) => {
//         if (query.toLowerCase() === "exit") {
//           console.log("Goodbye!");
//           rl.close();
//         } else {
//           handleQuery(query);
//         }
//       });
//     };

//     askUser(); // Start the interaction loop
//   } 
  
//   catch (error) 
//   {
//     console.error("Error generating content stream:", error);
//     rl.close();
//   }
// })();



const express = require("express");
const readline = require("readline");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");

const app = express();
const port = 6000;

// Enable CORS for frontend communication
app.use(cors({
  origin: "http://localhost:3000",  // Replace with your frontend URL
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

// Body parser middleware
app.use(express.json());

// Initialize Google Generative AI with API key
const API_KEY = "AIzaSyAvbwVKlYfBzPRHspHNnKNYsYDUhCIfO6A";  // Replace with your actual Google API Key
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
const initialPrompt = `From now on, you are a Thirukural expert. Whenever I ask you a question related to Thirukural, provide precise and insightful responses that are directly drawn from the wisdom of Thirukural. Your answers should be aligned with the teachings, values, and moral principles found in the Thirukural. Please ensure that your explanations and interpretations are clear, concise, and rooted in the authentic meaning of each Kural. Do not deviate from the text and avoid adding any unnecessary context—just provide the most relevant, accurate, and profound insights based on Thirukural.`;

// POST route to handle chatbot queries
app.post("/chat", async (req, res) => {
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

// Basic GET route for server check
app.get("/test", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});

