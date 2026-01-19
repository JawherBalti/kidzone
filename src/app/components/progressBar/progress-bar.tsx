"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface ProgressBarProps {
  allPhases: Array<any>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  getPhaseType: (index: number) => string;
}

const ProgressBar = ({
  allPhases,
  currentStep,
  setCurrentStep,
  getPhaseType,
}: ProgressBarProps) => {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current step when it changes
  useEffect(() => {
    const currentRef = stepRefs.current[currentStep];
    const container = containerRef.current;

    if (currentRef && container) {
      // Calculate position
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;
      const elementTop = currentRef.offsetTop;
      const elementBottom = elementTop + currentRef.clientHeight;

      // Check if element is not fully visible
      if (elementTop < containerTop || elementBottom > containerBottom) {
        // Scroll to center the element
        currentRef.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }
  }, [currentStep]);

  // Initialize refs array when phases change
  useEffect(() => {
    if (allPhases.length > stepRefs.current.length) {
      stepRefs.current = stepRefs.current.slice(0, allPhases.length);
    }
  }, [allPhases]);

  // Type-safe ref callback
  const setStepRef = (index: number) => (el: HTMLDivElement | null) => {
    stepRefs.current[index] = el;
  };

  const handleStepClick = (index: number) => {
    // Only allow clicking on completed steps or current step
    // if (index <= currentStep) {
    setCurrentStep(index);
    // }
  };

  return (
    <div className="flex flex-col gap-3 lg:w-1/3 bg-white rounded-3xl p-6 shadow-2xl border-4 border-blue-200">
      <h3 className="text-xl font-bold text-center text-gray-800">
        Your Journey
      </h3>

      {/* Progress indicator at top */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm font-bold text-blue-600">
            {Math.round(
              ((currentStep === 0 ? currentStep : currentStep + 1) /
                allPhases.length) *
                100
            )}
            %
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${
                ((currentStep === 0 ? currentStep : currentStep + 1) /
                  allPhases.length) *
                100
              }%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">
            Step {currentStep + 1} of {allPhases.length}
          </span>
          <span className="text-xs text-gray-500">
            {allPhases.length - (currentStep + 1)} steps left
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="space-y-3 overflow-y-auto overflow-x-hidden max-h-[400px] pr-2"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#93c5fd #f3f4f6" }}
      >
        {allPhases.map((step: any, index: number) => (
          <motion.div
            key={step.id}
            ref={setStepRef(index)}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
              index === currentStep
                ? "bg-yellow-100 border-2 border-yellow-400 shadow-md"
                : index < currentStep
                ? "bg-green-100 border-2 border-green-400"
                : "bg-gray-100 border-2 border-gray-300"
            } ${
              index <= currentStep
                ? "hover:shadow-lg"
                : "cursor-not-allowed opacity-60"
            }`}
            onClick={() => handleStepClick(index)}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                index === currentStep
                  ? "bg-yellow-500 text-white shadow-lg scale-110"
                  : index < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              {index < currentStep ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-gray-800">
                {getPhaseType(index).charAt(0).toUpperCase() +
                  getPhaseType(index).slice(1)}
              </span>
              {index === currentStep && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-gray-500 mt-1"
                >
                  Current step
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
