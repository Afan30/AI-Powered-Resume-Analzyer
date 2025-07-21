const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  parsedText: {
    type: String,
    required: true
  },
  vector: {
    type: [Number], // AI embedding vector for semantic matching
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', ResumeSchema);
