const mongoose = require("mongoose");

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://jawher94_db_user:Q5nLz1bnnB48GRvx@cluster0.e2qwhey.mongodb.net/?appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
module.exports = mongoose
