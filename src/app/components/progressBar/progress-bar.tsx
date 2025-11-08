"use client";

import { motion } from "framer-motion";

const ProgressBar = ({
    allPhases,
    currentStep,
    setCurrentStep,
    getPhaseType,
}: any) => {
    return (
        <div className="flex flex-col lg:w-1/3 bg-white rounded-3xl p-6 shadow-2xl border-4 border-blue-200">
            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
                Your Journey
            </h3>
            <div className="space-y-3 overflow-y-auto overflow-x-hidden">
                {allPhases.map((step: any, index: number) => (
                    <motion.div
                        key={step.id}
                        whileHover={{ scale: 1.05 }}
                        className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                            index === currentStep
                                ? "bg-yellow-100 border-2 border-yellow-400"
                                : index < currentStep
                                ? "bg-green-100 border-2 border-green-400"
                                : "bg-gray-100 border-2 border-gray-300"
                        }`}
                        onClick={() =>
                            // index < currentStep &&
                            setCurrentStep(index)
                        }
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                index === currentStep
                                    ? "bg-yellow-500 text-white"
                                    : index < currentStep
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-400 text-white"
                            }`}
                        >
                            {index + 1}
                        </div>
                        <span className="text-sm font-semibold">
                            {getPhaseType(index).charAt(0).toUpperCase() +
                                getPhaseType(index).slice(1)}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ProgressBar;
