const mongoose = require("mongoose")

// Simplified Game Schema
const gameSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    default: '/assets/default-game.png'
  },
  color: {
    type: String,
    required: true,
    default: 'from-blue-400 to-purple-400'
  },
  borderColor: {
    type: String,
    required: true,
    default: 'border-blue-400'
  },
  category: {
    type: String,
    required: true,
    enum: ['Logic', 'Reflexes', 'Shooter', 'Art', 'Puzzle', 'Adventure'],
    index: true
  },
  requiredLesson: {
    type: String,
    trim: true,
    index: true
  },
  isAlwaysAccessible: {
    type: Boolean,
    default: false,
    index: true
  },
  component: {
    type: String,
    required: true // e.g., 'MemoryMatchGame'
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: {
    transform: function(doc, ret) {
      // Remove MongoDB's _id and __v in responses
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      return ret;
    }
  }
});

// Create indexes for common queries
gameSchema.index({ category: 1, isAlwaysAccessible: 1 });
gameSchema.index({ isAlwaysAccessible: 1 });

// Create and export the model
module.exports = mongoose.model('Game', gameSchema);