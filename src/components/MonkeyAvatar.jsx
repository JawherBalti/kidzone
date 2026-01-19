"use client";
import { motion } from "framer-motion";

export default function MonkeyAvatar({ focusField, hasError }) {
  const isPassword =
    focusField === "password" || focusField === "confirmPassword";

  // Priority: error reaction overrides password reaction
  const showPasswordHide = !hasError && isPassword;

  return (
    <div className="w-48 mx-auto select-none">
      <motion.div
        animate={{
          rotate: showPasswordHide ? -2 : 0,
          x: hasError ? [0, -10, 10, -10, 10, 0] : 0, // shake
        }}
        transition={{
          rotate: { duration: 0.3, type: "spring" },
          x: hasError
            ? { duration: 0.5, ease: "easeInOut", repeat: 0 }
            : { duration: 0.2 },
        }}
        className="relative"
      >
        <svg
          viewBox="0 0 300 300"
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* --- Ears (drawn first = behind) --- */}
          <circle cx="50" cy="150" r="40" fill="#e0915c" />
          <circle cx="250" cy="150" r="40" fill="#e0915c" />

          {/* --- Monkey Head (drawn after = on top) --- */}
          <circle cx="150" cy="150" r="120" fill="#bb683d" />
          <circle cx="150" cy="175" r="80" fill="#f4b98e" />

          {/* --- Eyes Logic --- */}
          {!showPasswordHide && !hasError && (
            <>
              {/* Normal Eyes */}
              <circle cx="115" cy="130" r="22" fill="white" />
              <circle cx="185" cy="130" r="22" fill="white" />

              <motion.circle
                animate={{ cx: 118 }}
                cy="133"
                r="10"
                fill="black"
              />
              <motion.circle
                animate={{ cx: 188 }}
                cy="133"
                r="10"
                fill="black"
              />
            </>
          )}

          {showPasswordHide && !hasError && (
            <>
              {/* Closed Eyes (Password Focus) */}
              <motion.line
                x1="95"
                y1="130"
                x2="135"
                y2="130"
                stroke="black"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <motion.line
                x1="165"
                y1="130"
                x2="205"
                y2="130"
                stroke="black"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            </>
          )}

          {hasError && (
            <>
              {/* Normal Eyes */}
              <circle cx="115" cy="130" r="22" fill="white" />
              <circle cx="185" cy="130" r="22" fill="white" />

              <motion.circle
                animate={{ cx: 118 }}
                cy="133"
                r="10"
                fill="black"
              />
              <motion.circle
                animate={{ cx: 188 }}
                cy="133"
                r="10"
                fill="black"
              />
            </>
          )}

          {/* --- Mouth --- */}
          {!hasError ? (
            <path
              d="M120 200 Q150 230 180 200"
              stroke="black"
              strokeWidth="6"
              fill="transparent"
            />
          ) : (
            <path
              d="M120 210 Q150 180 180 210"
              stroke="black"
              strokeWidth="6"
              fill="transparent"
            />
          )}

          {/* --- Left Hand --- */}
          <motion.g
            animate={{
              y: showPasswordHide ? -70 : hasError ? 30 : 0,
            }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <circle cx="90" cy="230" r="40" fill="#fcbe90" />

            {/* Left Hand Finger Lines - Three more pronounced curved lines */}
            <path
              d="M90 215 Q105 200 120 210"
              stroke="#d19a6f"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M95 225 Q110 210 125 220"
              stroke="#d19a6f"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M100 235 Q110 220 130 230"
              stroke="#d19a6f"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
          </motion.g>

          {/* --- Right Hand --- */}
          <motion.g
            animate={{
              y: showPasswordHide ? -70 : hasError ? 30 : 0,
            }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <circle cx="210" cy="230" r="40" fill="#fcbe90" />

            {/* Right Hand Finger Lines - Three more pronounced curved lines (mirrored) */}
            <path
              d="M215 215 Q200 200 185 210"
              stroke="#d19a6f"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M210 225 Q195 210 180 220"
              stroke="#d19a6f"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M205 235 Q190 220 175 230"
              stroke="#d19a6f"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
}
