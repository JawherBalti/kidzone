// backend/scripts/seedLessons.js
const mongoose = require('mongoose');
const Lesson = require('../models/lesson');
require('dotenv').config();

const initialLessons = [
  {
    key: "shapes",
    color: "bg-green-300",
    icon: "/assets/learnShapes2.png",
    accessibleWithoutAuth: true,
    totalCompletions:0
  },
  {
    key: "animals",
    color: "bg-orange-300",
    icon: "/assets/learnAnimals.png",
    accessibleWithoutAuth: true,
    totalCompletions:0
  },
  {
    key: "numbers",
    color: "bg-yellow-300",
    icon: "/assets/learnNumbers.png",
    accessibleWithoutAuth: true,
    totalCompletions:0
  },
  {
    key: "colors",
    color: "bg-blue-300",
    icon: "/assets/learnColors.png",
    accessibleWithoutAuth: false,
    totalCompletions:0
  },
  {
    key: "alphabet",
    color: "bg-pink-300",
    icon: "/assets/learnAlphabet.png",
    accessibleWithoutAuth: false,
    totalCompletions:0
  },
  {
    key: "weather",
    color: "bg-purple-300",
    icon: "/assets/learnWeather.png",
    accessibleWithoutAuth: false,
    totalCompletions:0
  },
  {
    key: "food",
    color: "bg-purple-300",
    icon: "/assets/learnFood.png",
    accessibleWithoutAuth: false,
    totalCompletions:0
  },
  {
    key: "transportation",
    color: "bg-purple-300",
    icon: "/assets/learnTransportation.png",
    accessibleWithoutAuth: false,
    totalCompletions:0
  }
];

async function seedLessons() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://jawher94_db_user:Q5nLz1bnnB48GRvx@cluster0.e2qwhey.mongodb.net/?appName=Cluster0');
    console.log('✅ Connected to MongoDB');

    // Clear existing lessons
    await Lesson.deleteMany({});
    console.log('🗑️  Cleared existing lessons');

    // Insert new lessons
    await Lesson.insertMany(initialLessons);
    console.log(`✅ Seeded ${initialLessons.length} lessons`);

    // Verify
    const count = await Lesson.countDocuments();
    console.log(`📊 Total lessons in database: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding lessons:', error);
    process.exit(1);
  }
}

seedLessons();

// node scripts/seedLessons.js