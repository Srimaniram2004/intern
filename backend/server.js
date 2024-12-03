const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const kuralRoutes = require('./routes/kural'); // Ensure this path is correct

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Routes
app.use('/api/kural', kuralRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
