// backend/models/Lesson.js
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  // Match your array structure exactly
  key: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  color: {
    type: String,
    required: true,
    default: 'bg-gray-300'
  },
  icon: {
    type: String,
    required: true
  },
  accessibleWithoutAuth: {
    type: Boolean,
    required: true,
    default: false
  },
  
  // Stats (optional)
  totalCompletions: {
    type: Number,
    default: 0
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
lessonSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Lesson', lessonSchema);