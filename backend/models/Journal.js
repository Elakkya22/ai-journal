const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  ambience: {
    type: String,
    default: "none"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Journal", JournalSchema);