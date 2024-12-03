const mongoose = require('mongoose');

const kuralSchema = new mongoose.Schema({
  Verse: {
    type: String,
    required: true,
  },
  Explanation: {
    type: String,
    required: true,
  },
  Translation:{
      type: String,
      required: true,
  },
  Date: {  // Add a Date field to sort the Kurals by date if needed
    type: Date,
    default: Date.now,
  },
});

const Kural = mongoose.model('Kural', kuralSchema);

module.exports = Kural;
