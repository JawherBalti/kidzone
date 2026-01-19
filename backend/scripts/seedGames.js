// backend/scripts/seedLessons.js
const mongoose = require('mongoose');
const Game = require('../models/game');
require('dotenv').config();

const initialGames = [
  {
    id: 'memory-match',
    name: 'Animal Memory Match',
    description: 'Find matching pairs of cards!',
    image: '/assets/animalMemory.PNG',
    color: 'from-blue-400 to-purple-400',
    borderColor: 'border-blue-400',
    category: 'Logic',
    isAlwaysAccessible: true,
    component: 'MemoryMatchGame'
  },
  {
    id: 'rabbit-game',
    name: 'Rabbit Runner',
    description: 'Help rabbit avoid wild animals in his way home!',
    image: '/assets/rabbitGame.PNG',
    color: 'from-red-400 to-pink-400',
    borderColor: 'border-red-400',
    category: 'Reflexes',
    requiredLesson: 'animals',
    isAlwaysAccessible: false,
    component: 'RabbitGame'
  },
  {
    id: 'shape-puzzle',
    name: 'Shape Builder',
    description: 'Build fun shapes and objects!',
    image: '/assets/shapePuzzle.png',
    color: 'from-green-400 to-teal-400',
    borderColor: 'border-green-400',
    category: 'Logic',
    requiredLesson: 'shapes',
    isAlwaysAccessible: false,
    component: 'ShapePuzzleGame'
  },
  {
    id: 'shape-carnival',
    name: 'Shape Carnival',
    description: 'Catch the falling shapes in the correct bins!',
    image: '/assets/shapeCarnival.png',
    color: 'from-yellow-400 to-orange-400',
    borderColor: 'border-yellow-400',
    category: 'Logic',
    isAlwaysAccessible: true,
    component: 'ShapeCarnivalGame'
  },
  {
    id: 'pop-baloon',
    name: 'Pop The Bubble',
    description: 'Pop target bubbles before they reach the bottom!',
    image: '/assets/popBaloon.png',
    color: 'from-purple-400 to-indigo-400',
    borderColor: 'border-purple-400',
    category: 'Shooter',
    requiredLesson: 'numbers',
    isAlwaysAccessible: false,
    component: 'PopBaloonGame'
  },
  {
    id: 'pizza-chef',
    name: 'Pizza Chef',
    description: 'Make pizza using the needed ingredients!',
    image: '/assets/pizzaChef.png',
    color: 'from-brown-400 to-orange-400',
    borderColor: 'border-brown-400',
    category: 'Logic',
    isAlwaysAccessible: true,
    component: 'PizzaChefGame'
  },
  {
    id: 'weather-crash',
    name: 'Weather Crash',
    description: 'Swap adjacent symbols to make matches of 3 or more',
    image: '/assets/weatherCrash.png',
    color: 'from-sky-400 to-blue-400',
    borderColor: 'border-sky-400',
    category: 'Logic',
    requiredLesson: 'weather',
    isAlwaysAccessible: false,
    component: 'WeatherCrash'
  },
  {
    id: 'weather-defender',
    name: 'Weather Defender',
    description: 'Protect the city from bad weather',
    image: '/assets/weatherDefender.png',
    color: 'from-cyan-400 to-teal-400',
    borderColor: 'border-cyan-400',
    category: 'Logic',
    requiredLesson: 'weather',
    isAlwaysAccessible: false,
    component: 'WeatherDefender'
  },
  {
    id: 'train-maze',
    name: 'Train Maze',
    description: 'Help the train escape the maze',
    image: '/assets/trainMaze.png',
    color: 'from-orange-400 to-red-400',
    borderColor: 'border-orange-400',
    category: 'Logic',
    requiredLesson: 'transportation',
    isAlwaysAccessible: false,
    component: 'TrainMazeGame'
  },
  {
    id: 'transportation-frog',
    name: 'Frogger',
    description: 'Avoid the vehicles and reach the top!',
    image: '/assets/frogger.png',
    color: 'from-green-400 to-emerald-400',
    borderColor: 'border-green-400',
    category: 'Reflexes',
    requiredLesson: 'transportation',
    isAlwaysAccessible: false,
    component: 'TransportationFrogger'
  },
  {
    id: 'nutrition-ball',
    name: 'Nutrition Ball',
    description: 'Break all blocks to win',
    image: '/assets/nutritionBall.png',
    color: 'from-lime-400 to-green-400',
    borderColor: 'border-lime-400',
    category: 'Reflexes',
    requiredLesson: 'food',
    isAlwaysAccessible: false,
    component: 'NutritionBall'
  },
  {
    id: 'snake-food',
    name: 'Hungry Snake',
    description: 'Eat all food and avoid obstacles!',
    image: '/assets/snakeFeast.png',
    color: 'from-emerald-400 to-green-400',
    borderColor: 'border-emerald-400',
    category: 'Reflexes',
    requiredLesson: 'food',
    isAlwaysAccessible: false,
    component: 'SnakeFoodGame'
  },
  {
    id: 'color-sorting',
    name: 'Color Sorting',
    description: 'Drag objects to their correct color!',
    image: '/assets/colorSorting.png',
    color: 'from-violet-400 to-purple-400',
    borderColor: 'border-violet-400',
    category: 'Logic',
    requiredLesson: 'colors',
    isAlwaysAccessible: false,
    component: 'ColorSortingGame'
  },
  {
    id: 'color-book',
    name: 'Color Book',
    description: 'Pick your favorite colors, and bring pictures to life!',
    image: '/assets/colorBook.png',
    color: 'from-pink-400 to-rose-400',
    borderColor: 'border-pink-400',
    category: 'Art',
    requiredLesson: 'colors',
    isAlwaysAccessible: false,
    component: 'ColoringGame'
  },
  {
    id: 'word-invader',
    name: 'Word Invader',
    description: 'Shoot the letters to spell the word!',
    image: '/assets/wordInvader.png',
    color: 'from-blue-400 to-indigo-400',
    borderColor: 'border-blue-400',
    category: 'Shooter',
    requiredLesson: 'alphabet',
    isAlwaysAccessible: false,
    component: 'WordInvader'
  },
  {
    id: 'alphabet-maze',
    name: 'Alphabet Maze',
    description: 'Collect letters while avoiding enemies!',
    image: '/assets/alphabetMaze.png',
    color: 'from-amber-400 to-orange-400',
    borderColor: 'border-amber-400',
    category: 'Reflexes',
    requiredLesson: 'alphabet',
    isAlwaysAccessible: false,
    component: 'AlphabetMaze'
  }
];

async function seedGames() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://jawher94_db_user:Q5nLz1bnnB48GRvx@cluster0.e2qwhey.mongodb.net/?appName=Cluster0');
    console.log('✅ Connected to MongoDB');

    // Clear existing lessons
    await Game.deleteMany({});
    console.log('🗑️  Cleared existing lessons');

    // Insert new lessons
    await Game.insertMany(initialGames);
    console.log(`✅ Seeded ${initialGames.length} lessons`);

    // Verify
    const count = await Game.countDocuments();
    console.log(`📊 Total lessons in database: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding lessons:', error);
    process.exit(1);
  }
}

seedGames();

// node scripts/seedLessons.js