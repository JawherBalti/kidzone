"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WordInvader from "./word-invader";
import AlphabetMaze from "./alphabet-maze";
import Celebration from "@/app/components/celebration/celebration";
import ProgressBar from "@/app/components/progressBar/progress-bar";

interface AlphabetItem {
  id: number;
  letter: string;
  name: string;
  emoji: string;
  objects: string[];
  sound: string;
  options?: string[];
  target?: string;
  hint?: string;
  visualCount?: number;
}

export default function AlphabetPage() {
  // Phase 1: Letter Introduction & Learning - COMPLETE A-Z
  const learningLetters: AlphabetItem[] = [
    // A-J (existing)
    {
      id: 1,
      letter: "A",
      name: "A",
      emoji: "🅰️",
      objects: ["🍎", "🐜", "✈️"],
      sound: "A like Apple",
      visualCount: 1,
    },
    {
      id: 2,
      letter: "B",
      name: "B",
      emoji: "🅱️",
      objects: ["🐝", "🦋", "📚"],
      sound: "B like Bee",
      visualCount: 1,
    },
    {
      id: 3,
      letter: "C",
      name: "C",
      emoji: "©️",
      objects: ["🐱", "🐄", "🍪"],
      sound: "C like Cat",
      visualCount: 1,
    },
    {
      id: 4,
      letter: "D",
      name: "D",
      emoji: "🇩",
      objects: ["🐶", "🦆", "🚪"],
      sound: "D like Dog",
      visualCount: 1,
    },
    {
      id: 5,
      letter: "E",
      name: "E",
      emoji: "🇪",
      objects: ["🐘", "🥚", "👂"],
      sound: "E like Elephant",
      visualCount: 1,
    },
    {
      id: 6,
      letter: "F",
      name: "F",
      emoji: "🇫",
      objects: ["🐠", "🌸", "👣"],
      sound: "F like Fish",
      visualCount: 1,
    },
    {
      id: 7,
      letter: "G",
      name: "G",
      emoji: "🇬",
      objects: ["🦒", "🍇", "🎁"],
      sound: "G like Giraffe",
      visualCount: 1,
    },
    {
      id: 8,
      letter: "H",
      name: "H",
      emoji: "🇭",
      objects: ["🏠", "❤️", "🦛"],
      sound: "H like House",
      visualCount: 1,
    },
    {
      id: 9,
      letter: "I",
      name: "I",
      emoji: "🇮",
      objects: ["🍦", "👁️", "❄️"],
      sound: "I like Ice Cream",
      visualCount: 1,
    },
    {
      id: 10,
      letter: "J",
      name: "J",
      emoji: "🇯",
      objects: ["🪀", "🧃", "🦒"],
      sound: "J like Jack-in-the-box",
      visualCount: 1,
    },

    // K-T (new)
    {
      id: 11,
      letter: "K",
      name: "K",
      emoji: "🇰",
      objects: ["🪁", "👑", "🥝"],
      sound: "K like Kite",
      visualCount: 1,
    },
    {
      id: 12,
      letter: "L",
      name: "L",
      emoji: "🇱",
      objects: ["🦁", "🍋", "💡"],
      sound: "L like Lion",
      visualCount: 1,
    },
    {
      id: 13,
      letter: "M",
      name: "M",
      emoji: "🇲",
      objects: ["🐒", "🌙", "🥛"],
      sound: "M like Monkey",
      visualCount: 1,
    },
    {
      id: 14,
      letter: "N",
      name: "N",
      emoji: "🇳",
      objects: ["👃", "🌰", "🌙"],
      sound: "N like Nose",
      visualCount: 1,
    },
    {
      id: 15,
      letter: "O",
      name: "O",
      emoji: "🅾️",
      objects: ["🐙", "🍊", "⭕"],
      sound: "O like Octopus",
      visualCount: 1,
    },
    {
      id: 16,
      letter: "P",
      name: "P",
      emoji: "🅿️",
      objects: ["🐧", "🐷", "🍕"],
      sound: "P like Penguin",
      visualCount: 1,
    },
    {
      id: 17,
      letter: "Q",
      name: "Q",
      emoji: "🇶",
      objects: ["👑", "🐤", "❓"],
      sound: "Q like Queen",
      visualCount: 1,
    },
    {
      id: 18,
      letter: "R",
      name: "R",
      emoji: "🇷",
      objects: ["🐇", "🌈", "🤖"],
      sound: "R like Rabbit",
      visualCount: 1,
    },
    {
      id: 19,
      letter: "S",
      name: "S",
      emoji: "🇸",
      objects: ["🐍", "⭐", "🐌"],
      sound: "S like Snake",
      visualCount: 1,
    },
    {
      id: 20,
      letter: "T",
      name: "T",
      emoji: "🇹",
      objects: ["🐯", "🌲", "☕"],
      sound: "T like Tiger",
      visualCount: 1,
    },

    // U-Z (new)
    {
      id: 21,
      letter: "U",
      name: "U",
      emoji: "🇺",
      objects: ["☂️", "🐄", "👆"],
      sound: "U like Umbrella",
      visualCount: 1,
    },
    {
      id: 22,
      letter: "V",
      name: "V",
      emoji: "🇻",
      objects: ["🌋", "🎻", "✌️"],
      sound: "V like Volcano",
      visualCount: 1,
    },
    {
      id: 23,
      letter: "W",
      name: "W",
      emoji: "🇼",
      objects: ["🐋", "💧", "🪰"],
      sound: "W like Whale",
      visualCount: 1,
    },
    {
      id: 24,
      letter: "X",
      name: "X",
      emoji: "❌",
      objects: ["❌", "🦊", "📦"],
      sound: "X like X-ray",
      visualCount: 1,
    },
    {
      id: 25,
      letter: "Y",
      name: "Y",
      emoji: "🇾",
      objects: ["🪀", "🟡", "👍"],
      sound: "Y like Yo-yo",
      visualCount: 1,
    },
    {
      id: 26,
      letter: "Z",
      name: "Z",
      emoji: "🇿",
      objects: ["🦓", "⚡", "😴"],
      sound: "Z like Zebra",
      visualCount: 1,
    },
  ];

  // Phase 2: Letter Recognition - Expanded for A-Z
  const recognitionLetters: AlphabetItem[] = [
    // A-J (existing)
    {
      id: 27,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "A",
      options: ["C", "A", "B"],
      hint: "This letter starts with Apple! 🍎",
    },
    {
      id: 28,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "B",
      options: ["D", "B", "E"],
      hint: "This letter starts with Bee! 🐝",
    },
    {
      id: 29,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "C",
      options: ["F", "C", "G"],
      hint: "This letter starts with Cat! 🐱",
    },
    {
      id: 30,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "D",
      options: ["H", "D", "I"],
      hint: "This letter starts with Dog! 🐶",
    },
    {
      id: 31,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "E",
      options: ["J", "E", "F"],
      hint: "This letter starts with Elephant! 🐘",
    },
    {
      id: 32,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "F",
      options: ["G", "F", "H"],
      hint: "This letter starts with Fish! 🐠",
    },
    {
      id: 33,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "G",
      options: ["H", "G", "I"],
      hint: "This letter starts with Giraffe! 🦒",
    },
    {
      id: 34,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "H",
      options: ["I", "H", "J"],
      hint: "This letter starts with House! 🏠",
    },
    {
      id: 35,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "I",
      options: ["J", "I", "K"],
      hint: "This letter starts with Ice Cream! 🍦",
    },
    {
      id: 36,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "J",
      options: ["K", "J", "L"],
      hint: "This letter starts with Jack-in-the-box! 🪀",
    },

    // K-T (new)
    {
      id: 37,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "K",
      options: ["L", "K", "M"],
      hint: "This letter starts with Kite! 🪁",
    },
    {
      id: 38,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "L",
      options: ["M", "L", "N"],
      hint: "This letter starts with Lion! 🦁",
    },
    {
      id: 39,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "M",
      options: ["N", "M", "O"],
      hint: "This letter starts with Monkey! 🐒",
    },
    {
      id: 40,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "N",
      options: ["O", "N", "P"],
      hint: "This letter starts with Nose! 👃",
    },
    {
      id: 41,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "O",
      options: ["P", "O", "Q"],
      hint: "This letter starts with Octopus! 🐙",
    },
    {
      id: 42,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "P",
      options: ["Q", "P", "R"],
      hint: "This letter starts with Penguin! 🐧",
    },
    {
      id: 43,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "Q",
      options: ["R", "Q", "S"],
      hint: "This letter starts with Queen! 👑",
    },
    {
      id: 44,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "R",
      options: ["S", "R", "T"],
      hint: "This letter starts with Rabbit! 🐇",
    },
    {
      id: 45,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "S",
      options: ["T", "S", "U"],
      hint: "This letter starts with Snake! 🐍",
    },
    {
      id: 46,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "T",
      options: ["U", "T", "V"],
      hint: "This letter starts with Tiger! 🐯",
    },

    // U-Z (new)
    {
      id: 47,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "U",
      options: ["V", "U", "W"],
      hint: "This letter starts with Umbrella! ☂️",
    },
    {
      id: 48,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "V",
      options: ["W", "V", "X"],
      hint: "This letter starts with Volcano! 🌋",
    },
    {
      id: 49,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "W",
      options: ["X", "W", "Y"],
      hint: "This letter starts with Whale! 🐋",
    },
    {
      id: 50,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "X",
      options: ["Y", "X", "Z"],
      hint: "This letter starts with X-ray! ❌",
    },
    {
      id: 51,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "Y",
      options: ["Z", "Y", "A"],
      hint: "This letter starts with Yo-yo! 🪀",
    },
    {
      id: 52,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "",
      target: "Z",
      options: ["A", "Z", "B"],
      hint: "This letter starts with Zebra! 🦓",
    },
  ];

  // Phase 3: Object Letter Matching - Expanded for A-Z
  const objectLetters: AlphabetItem[] = [
    // A-J (existing)
    {
      id: 53,
      letter: "",
      name: "apple",
      emoji: "🍎",
      objects: [],
      sound: "",
      target: "A",
      options: ["A", "B", "C"],
      hint: "Apple starts with A!",
      visualCount: 1,
    },
    {
      id: 54,
      letter: "",
      name: "ball",
      emoji: "⚽",
      objects: [],
      sound: "",
      target: "B",
      options: ["C", "B", "D"],
      hint: "Ball starts with B!",
      visualCount: 1,
    },
    {
      id: 55,
      letter: "",
      name: "cat",
      emoji: "🐱",
      objects: [],
      sound: "",
      target: "C",
      options: ["D", "C", "E"],
      hint: "Cat starts with C!",
      visualCount: 1,
    },
    {
      id: 56,
      letter: "",
      name: "dog",
      emoji: "🐶",
      objects: [],
      sound: "",
      target: "D",
      options: ["E", "D", "F"],
      hint: "Dog starts with D!",
      visualCount: 1,
    },
    {
      id: 57,
      letter: "",
      name: "elephant",
      emoji: "🐘",
      objects: [],
      sound: "",
      target: "E",
      options: ["F", "E", "G"],
      hint: "Elephant starts with E!",
      visualCount: 1,
    },
    {
      id: 58,
      letter: "",
      name: "fish",
      emoji: "🐠",
      objects: [],
      sound: "",
      target: "F",
      options: ["G", "F", "H"],
      hint: "Fish starts with F!",
      visualCount: 1,
    },
    {
      id: 59,
      letter: "",
      name: "giraffe",
      emoji: "🦒",
      objects: [],
      sound: "",
      target: "G",
      options: ["H", "G", "I"],
      hint: "Giraffe starts with G!",
      visualCount: 1,
    },
    {
      id: 60,
      letter: "",
      name: "house",
      emoji: "🏠",
      objects: [],
      sound: "",
      target: "H",
      options: ["I", "H", "J"],
      hint: "House starts with H!",
      visualCount: 1,
    },
    {
      id: 61,
      letter: "",
      name: "ice cream",
      emoji: "🍦",
      objects: [],
      sound: "",
      target: "I",
      options: ["J", "I", "K"],
      hint: "Ice Cream starts with I!",
      visualCount: 1,
    },
    {
      id: 62,
      letter: "",
      name: "jack-in-the-box",
      emoji: "🪀",
      objects: [],
      sound: "",
      target: "J",
      options: ["K", "J", "L"],
      hint: "Jack-in-the-box starts with J!",
      visualCount: 1,
    },

    // K-T (new)
    {
      id: 63,
      letter: "",
      name: "kite",
      emoji: "🪁",
      objects: [],
      sound: "",
      target: "K",
      options: ["L", "K", "M"],
      hint: "Kite starts with K!",
      visualCount: 1,
    },
    {
      id: 64,
      letter: "",
      name: "lion",
      emoji: "🦁",
      objects: [],
      sound: "",
      target: "L",
      options: ["M", "L", "N"],
      hint: "Lion starts with L!",
      visualCount: 1,
    },
    {
      id: 65,
      letter: "",
      name: "monkey",
      emoji: "🐒",
      objects: [],
      sound: "",
      target: "M",
      options: ["N", "M", "O"],
      hint: "Monkey starts with M!",
      visualCount: 1,
    },
    {
      id: 66,
      letter: "",
      name: "nose",
      emoji: "👃",
      objects: [],
      sound: "",
      target: "N",
      options: ["O", "N", "P"],
      hint: "Nose starts with N!",
      visualCount: 1,
    },
    {
      id: 67,
      letter: "",
      name: "octopus",
      emoji: "🐙",
      objects: [],
      sound: "",
      target: "O",
      options: ["P", "O", "Q"],
      hint: "Octopus starts with O!",
      visualCount: 1,
    },
    {
      id: 68,
      letter: "",
      name: "penguin",
      emoji: "🐧",
      objects: [],
      sound: "",
      target: "P",
      options: ["Q", "P", "R"],
      hint: "Penguin starts with P!",
      visualCount: 1,
    },
    {
      id: 69,
      letter: "",
      name: "queen",
      emoji: "👑",
      objects: [],
      sound: "",
      target: "Q",
      options: ["R", "Q", "S"],
      hint: "Queen starts with Q!",
      visualCount: 1,
    },
    {
      id: 70,
      letter: "",
      name: "rabbit",
      emoji: "🐇",
      objects: [],
      sound: "",
      target: "R",
      options: ["S", "R", "T"],
      hint: "Rabbit starts with R!",
      visualCount: 1,
    },
    {
      id: 71,
      letter: "",
      name: "snake",
      emoji: "🐍",
      objects: [],
      sound: "",
      target: "S",
      options: ["T", "S", "U"],
      hint: "Snake starts with S!",
      visualCount: 1,
    },
    {
      id: 72,
      letter: "",
      name: "tiger",
      emoji: "🐯",
      objects: [],
      sound: "",
      target: "T",
      options: ["U", "T", "V"],
      hint: "Tiger starts with T!",
      visualCount: 1,
    },

    // U-Z (new)
    {
      id: 73,
      letter: "",
      name: "umbrella",
      emoji: "☂️",
      objects: [],
      sound: "",
      target: "U",
      options: ["V", "U", "W"],
      hint: "Umbrella starts with U!",
      visualCount: 1,
    },
    {
      id: 74,
      letter: "",
      name: "volcano",
      emoji: "🌋",
      objects: [],
      sound: "",
      target: "V",
      options: ["W", "V", "X"],
      hint: "Volcano starts with V!",
      visualCount: 1,
    },
    {
      id: 75,
      letter: "",
      name: "whale",
      emoji: "🐋",
      objects: [],
      sound: "",
      target: "W",
      options: ["X", "W", "Y"],
      hint: "Whale starts with W!",
      visualCount: 1,
    },
    {
      id: 76,
      letter: "",
      name: "x-ray",
      emoji: "❌",
      objects: [],
      sound: "",
      target: "X",
      options: ["Y", "X", "Z"],
      hint: "X-ray starts with X!",
      visualCount: 1,
    },
    {
      id: 77,
      letter: "",
      name: "yo-yo",
      emoji: "🪀",
      objects: [],
      sound: "",
      target: "Y",
      options: ["Z", "Y", "A"],
      hint: "Yo-yo starts with Y!",
      visualCount: 1,
    },
    {
      id: 78,
      letter: "",
      name: "zebra",
      emoji: "🦓",
      objects: [],
      sound: "",
      target: "Z",
      options: ["A", "Z", "B"],
      hint: "Zebra starts with Z!",
      visualCount: 1,
    },
  ];

  // Phase 4: Letter Sounds - Expanded for A-Z
  const letterSounds: AlphabetItem[] = [
    // A-J (existing)
    {
      id: 79,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "A like Apple",
      target: "A",
      options: ["A", "B", "C"],
      hint: "Listen for the 'A' sound like in Apple! 🍎",
    },
    {
      id: 80,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "B like Ball",
      target: "B",
      options: ["C", "B", "D"],
      hint: "Listen for the 'B' sound like in Ball! ⚽",
    },
    {
      id: 81,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "C like Cat",
      target: "C",
      options: ["D", "C", "E"],
      hint: "Listen for the 'C' sound like in Cat! 🐱",
    },
    {
      id: 82,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "D like Duck",
      target: "D",
      options: ["E", "D", "F"],
      hint: "Listen for the 'D' sound like in Duck! 🦆",
    },
    {
      id: 83,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "E like Egg",
      target: "E",
      options: ["F", "E", "G"],
      hint: "Listen for the 'E' sound like in Egg! 🥚",
    },
    {
      id: 84,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "F like Fish",
      target: "F",
      options: ["G", "F", "H"],
      hint: "Listen for the 'F' sound like in Fish! 🐠",
    },
    {
      id: 85,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "G like Goat",
      target: "G",
      options: ["H", "G", "I"],
      hint: "Listen for the 'G' sound like in Goat! 🐐",
    },
    {
      id: 86,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "H like Hat",
      target: "H",
      options: ["I", "H", "J"],
      hint: "Listen for the 'H' sound like in Hat! 🎩",
    },
    {
      id: 87,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "I like Igloo",
      target: "I",
      options: ["J", "I", "K"],
      hint: "Listen for the 'I' sound like in Igloo! 🏠",
    },
    {
      id: 88,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "J like Jam",
      target: "J",
      options: ["K", "J", "L"],
      hint: "Listen for the 'J' sound like in Jam! 🍓",
    },

    // K-T (new)
    {
      id: 89,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "K like Kangaroo",
      target: "K",
      options: ["L", "K", "M"],
      hint: "Listen for the 'K' sound like in Kangaroo! 🦘",
    },
    {
      id: 90,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "L like Leaf",
      target: "L",
      options: ["M", "L", "N"],
      hint: "Listen for the 'L' sound like in Leaf! 🍃",
    },
    {
      id: 91,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "M like Moon",
      target: "M",
      options: ["N", "M", "O"],
      hint: "Listen for the 'M' sound like in Moon! 🌙",
    },
    {
      id: 92,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "N like Nest",
      target: "N",
      options: ["O", "N", "P"],
      hint: "Listen for the 'N' sound like in Nest! 🪺",
    },
    {
      id: 93,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "O like Orange",
      target: "O",
      options: ["P", "O", "Q"],
      hint: "Listen for the 'O' sound like in Orange! 🍊",
    },
    {
      id: 94,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "P like Pig",
      target: "P",
      options: ["Q", "P", "R"],
      hint: "Listen for the 'P' sound like in Pig! 🐷",
    },
    {
      id: 95,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "Q like Queen",
      target: "Q",
      options: ["R", "Q", "S"],
      hint: "Listen for the 'Q' sound like in Queen! 👑",
    },
    {
      id: 96,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "R like Rainbow",
      target: "R",
      options: ["S", "R", "T"],
      hint: "Listen for the 'R' sound like in Rainbow! 🌈",
    },
    {
      id: 97,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "S like Sun",
      target: "S",
      options: ["T", "S", "U"],
      hint: "Listen for the 'S' sound like in Sun! ☀️",
    },
    {
      id: 98,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "T like Turtle",
      target: "T",
      options: ["U", "T", "V"],
      hint: "Listen for the 'T' sound like in Turtle! 🐢",
    },

    // U-Z (new)
    {
      id: 99,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "U like Up",
      target: "U",
      options: ["V", "U", "W"],
      hint: "Listen for the 'U' sound like in Up! 👆",
    },
    {
      id: 100,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "V like Violin",
      target: "V",
      options: ["W", "V", "X"],
      hint: "Listen for the 'V' sound like in Violin! 🎻",
    },
    {
      id: 101,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "W like Water",
      target: "W",
      options: ["X", "W", "Y"],
      hint: "Listen for the 'W' sound like in Water! 💧",
    },
    {
      id: 102,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "X like Xylophone",
      target: "X",
      options: ["Y", "X", "Z"],
      hint: "Listen for the 'X' sound like in Xylophone! 🎵",
    },
    {
      id: 103,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "Y like Yellow",
      target: "Y",
      options: ["Z", "Y", "A"],
      hint: "Listen for the 'Y' sound like in Yellow! 🟡",
    },
    {
      id: 104,
      letter: "",
      name: "",
      emoji: "",
      objects: [],
      sound: "Z like Zoo",
      target: "Z",
      options: ["A", "Z", "B"],
      hint: "Listen for the 'Z' sound like in Zoo! 🦁",
    },
  ];

  const allPhases = [
    ...learningLetters,
    ...recognitionLetters,
    ...objectLetters,
    ...letterSounds,
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isPlayingWordInvader, setIsPlayingWordInvader] = useState(false);
  const [isPlayingAlphabetMaze, setIsPlayingAlphabetMaze] = useState(false);

  const current = allPhases[currentStep];
  const isLearningPhase = currentStep < learningLetters.length;
  const isRecognitionPhase =
    currentStep < learningLetters.length + recognitionLetters.length &&
    currentStep >= learningLetters.length;
  const isObjectPhase =
    currentStep <
      learningLetters.length +
        recognitionLetters.length +
        objectLetters.length &&
    currentStep >= learningLetters.length + recognitionLetters.length;
  const isSoundPhase =
    currentStep <
      learningLetters.length +
        recognitionLetters.length +
        objectLetters.length +
        letterSounds.length &&
    currentStep >=
      learningLetters.length + recognitionLetters.length + objectLetters.length;

  const getPhaseType = (step: number) => {
    if (step < learningLetters.length) return "learning";
    if (step < learningLetters.length + recognitionLetters.length)
      return "recognition";
    if (
      step <
      learningLetters.length + recognitionLetters.length + objectLetters.length
    )
      return "object matching";
    if (
      step <
      learningLetters.length +
        recognitionLetters.length +
        objectLetters.length +
        letterSounds.length
    )
      return "letter sounds";
    return "memory";
  };

  const handleNext = () => {
    setFeedback("");
    if (currentStep < allPhases.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setShowCelebration(true);
    }
  };

  const handleAnswer = (answer: string) => {
    if (isRecognitionPhase || isObjectPhase || isSoundPhase) {
      if (answer === current.target) {
        setFeedback("🎉 Correct! You're an alphabet expert!");
        setScore(score + 10);
        setTimeout(handleNext, 1500);
      } else {
        setFeedback("🔤 Try again! " + (current.hint || ""));
      }
    }
  };

  const playLetterSound = (letter: string) => {
    console.log(`Playing sound for letter ${letter}`);
    // Web Speech API integration ready
    // const utterance = new SpeechSynthesisUtterance(letter);
    // speechSynthesis.speak(utterance);
  };

  const renderVisualLetter = (letter: string) => {
    return (
      <motion.div
        className="text-8xl font-bold mb-6 bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent"
        whileHover={{ scale: 1.2, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => playLetterSound(letter)}
      >
        {letter}
      </motion.div>
    );
  };

  const renderCurrentStep = () => {
    const phaseType = getPhaseType(currentStep);

    switch (phaseType) {
      case "learning":
        return (
          <div className="text-center">
            {/* Letter Display */}
            {renderVisualLetter(current.letter)}

            {/* Object Emojis */}
            <div className="flex justify-center gap-6 mb-6">
              {current.objects.map((object, index) => (
                <motion.div
                  key={index}
                  className="text-4xl"
                  whileHover={{ scale: 1.3, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {object}
                </motion.div>
              ))}
            </div>

            {/* Letter Writing Guide */}
            <div className="bg-green-100 p-2 rounded-2xl border-2 border-green-300 max-w-md mx-auto mb-6">
              <h3 className="text-xl font-bold text-green-800 mb-3">
                Let's Write {current.letter}!
              </h3>
              <div className="text-6xl font-bold text-green-600 mb-2">
                {current.letter}
              </div>
              <p className="text-green-700">
                Trace the letter with your finger! 👆
              </p>
            </div>

            <button
              onClick={handleNext}
              className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-xl rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
            >
              {currentStep < 25
                ? "Discover Next Letter ➜"
                : "Continue to Letter Games ➜"}
            </button>
          </div>
        );

      case "recognition":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Which letter is this?
            </h2>

            {/* Visual representation of the target letter */}
            <motion.div
              className="text-8xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {current.target}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {current.options?.map((letter, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(letter)}
                  className="p-8 rounded-2xl shadow-lg border-4 border-white bg-gradient-to-br from-yellow-400 to-orange-400 text-white text-3xl font-bold hover:brightness-110 transition-all"
                >
                  {letter}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "object matching":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              What letter does {current.name} start with?
            </h2>

            {/* Object Display */}
            <motion.div
              className="text-6xl mb-8"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {current.emoji}
            </motion.div>

            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
              {current.options?.map((letter, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(letter)}
                  className="p-3 rounded-2xl shadow-lg border-4 border-white bg-gradient-to-br from-green-400 to-blue-400 text-white text-2xl font-bold hover:brightness-110 transition-all"
                >
                  {letter}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case "letter sounds":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Which letter makes this sound?
            </h2>

            {/* Sound Description */}
            <motion.div
              className="bg-purple-100 p-8 rounded-2xl border-2 border-purple-300 max-w-md mx-auto mb-8"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-3xl font-bold text-purple-800 mb-4">
                "{current.sound}"
              </div>
              <button
                onClick={() => playLetterSound(current.target || "")}
                className="px-6 py-3 bg-purple-500 text-white rounded-full font-bold hover:scale-105 transition-transform"
              >
                🔊 Play Sound Again
              </button>
            </motion.div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {current.options?.map((letter, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(letter)}
                  className="p-6 rounded-2xl shadow-lg border-4 border-white bg-gradient-to-br from-red-400 to-pink-400 text-white text-2xl font-bold hover:brightness-110 transition-all"
                >
                  {letter}
                </motion.button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 w-full bg-gradient-to-b from-purple-50 to-pink-50 p-5">
      {!isPlayingWordInvader && !isPlayingAlphabetMaze ? (
        <div className="lg:max-h-[calc(100vh-165px)] flex flex-col lg:flex-row gap-5 max-w-6xl mx-auto">
          {/* Main Learning Area */}
          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl p-8 shadow-2xl border-4 border-yellow-200">
            <AnimatePresence mode="wait">
              {showCelebration ? (
                <Celebration
                  setCurrentStep={setCurrentStep}
                  score={score}
                  setScore={setScore}
                  setShowCelebration={setShowCelebration}
                  setIsPlayingGame1={setIsPlayingWordInvader}
                  gameName1="Alphabet Matching Game"
                  gameImage1="/assets/wordInvader.png"
                  setIsPlayingGame2={setIsPlayingAlphabetMaze}
                  gameName2="Alphabet Maze"
                  gameImage2="/assets/alphabetMaze.png"
                />
              ) : (
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                  className="text-center w-full"
                >
                  {renderCurrentStep()}

                  {feedback && (
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`text-2xl font-bold p-4 rounded-2xl mt-6 ${
                        feedback.includes("Correct") ||
                        feedback.includes("Great")
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {feedback}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress Bar */}
          <ProgressBar
            allPhases={allPhases}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            getPhaseType={getPhaseType}
          />
        </div>
      ) : isPlayingWordInvader ? (
        <WordInvader setIsPlayingWordInvader={setIsPlayingWordInvader} />
      ) : isPlayingAlphabetMaze ? 
        <AlphabetMaze setIsPlayingAlphabetMaze={setIsPlayingAlphabetMaze}/>
      : null}
    </div>
  );
}
