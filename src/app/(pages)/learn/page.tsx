"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Image from "next/image";

const categories = [
  {
    key: "shapes",
    color: "bg-green-300",
    icon: "/assets/learnShapes2.png",
    descriptionKey: "learn.shapesDesc",
  },
    {
    key: "animals",
    color: "bg-orange-300",
    icon: "/assets/learnAnimals.png",
    descriptionKey: "learn.animalsDesc",
  },
  {
    key: "numbers",
    color: "bg-yellow-300",
    icon: "/assets/learnNumbers.png",
    descriptionKey: "learn.numbersDesc",
  },
  {
    key: "colors",
    color: "bg-blue-300",
    icon: "/assets/learnColors.png",
    descriptionKey: "learn.colorsDesc",
  },
    {
    key: "alphabet",
    color: "bg-pink-300",
    icon: "/assets/learnAlphabet.png",
    descriptionKey: "learn.alphabetDesc",
  },

  {
    key: "words",
    color: "bg-purple-300",
    icon: "/assets/learnWords.png",
    descriptionKey: "learn.wordsDesc",
  },

];

export default function LearnPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-pink-100 py-16 px-6">
      {/* Hero Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center text-4xl md:text-6xl font-extrabold text-pink-600 mb-8"
      >
        {t("learn.title", "What do you want to learn today?")}
      </motion.h1>

      <p className="text-center text-lg md:text-2xl text-gray-700 mb-12 font-semibold">
        {t("learn.subtitle", "Tap a box to start your adventure!")}
      </p>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            className={`${cat.color} z-10 relative w-72 h-72 rounded-3xl shadow-xl flex flex-col justify-center items-center p-6 cursor-pointer hover:shadow-2xl transition`}
          >
            <Link href={`/learn/${cat.key}`} className="absolute w-full h-full flex flex-col items-center">
              <div className="z-20">
                <Image
                  src={cat.icon}
                  alt={cat.key}
                  fill
                  className="object-fill drop-shadow-lg rounded-3xl"
                />
              </div>

              <h2 className="outline-text mt-[80%] z-30 text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {t(`learn.${cat.key}`, cat.key.charAt(0).toUpperCase() + cat.key.slice(1))}
              </h2>
              <p className="outline-text z-30 font-bold text-gray-700 text-lg text-center px-4">
                {/* {t(cat.descriptionKey, "Fun and interactive lessons!")} */}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
