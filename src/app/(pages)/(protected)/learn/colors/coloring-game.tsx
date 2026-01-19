import useIsMdUp from "@/app/hooks/useIsMdUp";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface ShapeProps {
  selectedColor: string;
  width: string;
  height: string;
}
// Base shape component with common functionality
const PaintableShape = ({
  selectedColor,
  children,
  className = "",
  style = {},
}: any) => {
  const [bgColor, setBgColor] = useState("white");

  const handlePaint = (e: any) => {
    e.stopPropagation(); // 🛑 prevent parent shapes from being painted

    setBgColor(selectedColor);
  };

  return (
    <div
      onClick={handlePaint}
      className={`cursor-pointer transition-colors duration-200 ${className}`}
      style={{ backgroundColor: bgColor, ...style }}
    >
      {children}
    </div>
  );
};
const Ship = ({ selectedColor, width, height }: ShapeProps) => {
  return (
    <div
      className={` w-${width} h-${height} relative flex items-center justify-center mx-auto`}
    >
      {/* === Hull === */}
      <PaintableShape
        selectedColor={selectedColor}
        className="absolute bottom-0 w-[70%] h-20 bg-yellow-500 border-4 border-black rounded-b-full"
      />

      {/* === Deck === */}
      <PaintableShape
        selectedColor={selectedColor}
        className="absolute bottom-16 w-[50%] h-6 bg-yellow-400 border-4 border-black rounded-md"
      />

      <div className="absolute bottom-65">
        {/* === Mast === */}
        <PaintableShape
          selectedColor={selectedColor}
          className="absolute -top-0 w-4 h-30 bg-gray-800 border-2 border-black"
        />
        {/* === Flag === */}!
        <PaintableShape
          selectedColor={selectedColor}
          className="absolute top-0 w-10 h-6 bg-red-500 border-2 border-black -translate-x-1/2"
        />
      </div>

      {/* === Sails === */}
      <motion.div
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2"
      >
        <PaintableShape
          selectedColor={selectedColor}
          className="w-28 h-28 bg-white border-4 border-black rounded-tr-lg rounded-bl-lg"
        />
        <PaintableShape
          selectedColor={selectedColor}
          className="absolute top-0 left-1/2 w-20 h-20 bg-white border-4 border-black rounded-tr-lg rounded-bl-lg -translate-x-1/2"
        />
      </motion.div>

      {/* === Windows === */}
      <PaintableShape
        selectedColor={selectedColor}
        className="absolute bottom-6 left-[35%] w-6 h-6 bg-blue-400 border-2 border-black rounded-full"
      />
      <PaintableShape
        selectedColor={selectedColor}
        className="absolute bottom-6 right-[35%] w-6 h-6 bg-blue-400 border-2 border-black rounded-full"
      />
    </div>
  );
};

const Butterfly = ({ selectedColor, height, width }: ShapeProps) => {
  return (
    <div
      className={`h-${height} w-${width} relative cursor-pointer flex items-center justify-center`}
    >
      {/* 🩶 Body */}
      <PaintableShape
        selectedColor={selectedColor}
        className="z-50 absolute w-[12%] h-[80%] bg-white border-2 border-black rounded-full"
      />

      {/* 🩷 Upper Left Wing */}
      <PaintableShape
        selectedColor={selectedColor}
        className="absolute top-[5%] left-[5%] w-[55%] h-[50%] rounded-[70%] border-4 border-black bg-pink-200 transform -rotate-[20deg] origin-bottom-right shadow-md"
      />

      {/* 🩷 Upper Right Wing */}
      <PaintableShape
        selectedColor={selectedColor}
        className="absolute top-[5%] right-[5%] w-[55%] h-[50%] rounded-[70%] border-4 border-black bg-pink-200 transform rotate-[20deg] origin-bottom-left shadow-md"
      />

      {/* 💜 Lower Left Wing */}
      <PaintableShape
        selectedColor={selectedColor}
        className="absolute bottom-[5%] left-[10%] w-[40%] h-[40%] rounded-[70%] border-4 border-black bg-violet-200 transform -rotate-[10deg] origin-top-right shadow-md"
      />

      {/* 💜 Lower Right Wing */}
      <PaintableShape
        selectedColor={selectedColor}
        className="absolute bottom-[5%] right-[10%] w-[40%] h-[40%] rounded-[70%] border-4 border-black bg-violet-200 transform rotate-[10deg] origin-top-left shadow-md"
      />

      {/* 🪶 Antennae */}
      <div className="absolute top-[2%] left-1/2 -translate-x-[50%] flex gap-1">
        <div className="w-6 h-6 border-t-2 border-l-2 border-black rounded-tl-full rotate-[40deg]"></div>
        <div className="w-6 h-6 border-t-2 border-r-2 border-black rounded-tr-full -rotate-[40deg]"></div>
      </div>
    </div>
  );
};

const Icecream = ({ selectedColor, width, height }: ShapeProps) => (
  <div
    className={` w-${width} h-${height} relative cursor-pointer flex flex-col items-center w-16 h-24`}
  >
    {/* Cone */}

    {/* Scoops */}
    <PaintableShape
      selectedColor={selectedColor}
      className="w-[18%] h-[30%] rounded-full border-3 border-black -mb-1"
    ></PaintableShape>
    <PaintableShape
      selectedColor={selectedColor}
      className="w-[28%] h-[30%]  rounded-full border-3 border-black -mb-1"
    ></PaintableShape>
    <PaintableShape
      selectedColor={selectedColor}
      className="z-30 w-[38%] h-[30%]  rounded-full border-3 border-black -mb-2"
    ></PaintableShape>
    {/* Cherry */}
    <div className="relative w-1/2 h-full flex items-center justify-center">
      {/* Outer triangle – acts as border */}
      <div
        className="absolute"
        style={{
          width: "60%",
          height: "100%",
          clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
          backgroundColor: "black",
          transform: "scale(1.1)",
          zIndex: 0,
        }}
      />

      {/* Inner triangle – paintable area */}
      <PaintableShape
        selectedColor={selectedColor}
        className="relative z-10"
        style={{
          width: "50%",
          height: "100%",
          clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
          margin: "0 auto",
        }}
      />
    </div>

    {/* <div className="w-12 h-16 bg-yellow-600 border-3 border-yellow-800 rounded-b-lg"></div> */}
  </div>
);

const Car = ({ selectedColor, width, height }: ShapeProps) => {
  return (
    <div
      className={`relative w-${width} h-${height} flex items-center justify-center cursor-pointer`}
    >
      {/* 🚘 Body */}
      <PaintableShape
        selectedColor={selectedColor}
        className="z-20 absolute bottom-[10%] left-0 w-full h-[55%] bg-white border-4 border-black rounded-[40px] shadow-md"
      />

      {/* 🪟 Roof */}
      <PaintableShape
        selectedColor={selectedColor}
        className="absolute bottom-[65%] left-[15%] w-[70%] h-[35%] bg-white border-4 border-b-0 border-black rounded-t-[50px]"
      />

      {/* 🪟 Windows */}
      <div className="absolute bottom-[68%] left-[22%] flex gap-2 w-full">
        <PaintableShape
          selectedColor={selectedColor + "70"}
          className="w-1/4 h-[80px] bg-white/70 border-2 border-black rounded-md"
        />
        <PaintableShape
          selectedColor={selectedColor + "70"}
          className="w-1/4 h-[80px] bg-white/70 border-2 border-black rounded-md"
        />
      </div>

      {/* 🚪 Door */}
      {/* <div className="z-30 absolute bottom-[20%] left-[30%] w-[20%] h-[40%] border-4 border-black rounded-[15px]"></div> */}

      {/* ⚫ Wheels */}
      <PaintableShape
        selectedColor={selectedColor}
        className="z-30 absolute bottom-[0%] left-[12%] w-[100px] h-[100px] bg-white rounded-full border-4 border-gray-700 shadow-inner"
      />
      <PaintableShape
        selectedColor={selectedColor}
        className="z-30 absolute bottom-[0%] right-[12%] w-[100px] h-[100px] bg-white rounded-full border-4 border-gray-700 shadow-inner"
      />

      {/* 🔘 Wheel Hubs */}
      <PaintableShape
        selectedColor={selectedColor}
        className="z-30 absolute bottom-[8%] left-[17%] w-[40px] h-[40px] bg-white rounded-full border-2 border-gray-800"
      />
      <PaintableShape
        selectedColor={selectedColor}
        className="z-30 absolute bottom-[8%] right-[17%] w-[40px] h-[40px] bg-white rounded-full border-2 border-gray-800"
      />
      {/* 🔦 Headlight */}
      <PaintableShape
        selectedColor={selectedColor}
        className="z-10 absolute bottom-[35%] right-[-4%] w-[6%] h-[20%] bg-white border-2 border-black rounded-r-full"
      />

      {/* 🔴 Taillight */}
      <PaintableShape
        selectedColor={selectedColor}
        className="z-10 absolute bottom-[35%] left-[-4%] w-[6%] h-[20%] bg-white border-2 border-black rounded-l-full"
      />
      <div></div>
    </div>
  );
};

const Rabbit = ({ selectedColor, width, height }: ShapeProps) => {
  return (
    <div
      className={`relative w-${width} h-${height} flex items-center justify-center mx-auto`}
    >
      <div className="absolute w-56">
        {/* Left Ear */}
        <motion.div
          animate={{ rotate: [-10, -14, -10] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute -top-40 left-0"
        >
          <PaintableShape
            selectedColor={selectedColor}
            className="z-10 w-24 h-44 rounded-full bg-white border-4 border-black shadow-sm"
          >
            <PaintableShape
              selectedColor={selectedColor}
              className="z-20 absolute inset-8 inset-y-5 bg-white border-4 border-black rounded-full"
            />
          </PaintableShape>
        </motion.div>

        {/* Right Ear */}
        <motion.div
          animate={{ rotate: [10, 14, 10] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -top-40 right-0"
        >
          <PaintableShape
            selectedColor={selectedColor}
            className="z-10 w-24 h-44 rounded-full bg-white border-4 border-black shadow-sm"
          >
            <PaintableShape
              selectedColor={selectedColor}
              className="z-20 absolute inset-8 inset-y-5 bg-white border-4 border-black rounded-full"
            />
          </PaintableShape>
        </motion.div>

        {/* Face */}
        <PaintableShape
          selectedColor={selectedColor}
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full bg-white border-4 border-gray-800 shadow-lg"
        >
          {/* Eyes */}
          <PaintableShape
            selectedColor={selectedColor}
            className="absolute top-8 left-10 w-16 h-20 bg-white border-1 border-black rounded-full overflow-hidden"
          >
            <motion.div
              className="absolute top-3 left-3 w-8 h-8 bg-white border-1 border-black rounded-full"
              animate={{ y: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </PaintableShape>
          <PaintableShape
            selectedColor={selectedColor}
            className="absolute top-8 right-10 w-16 h-20 bg-white border-1 border-black rounded-full overflow-hidden"
          >
            <motion.div
              className="absolute top-3 right-3 w-8 h-8 bg-white border-1 border-black rounded-full"
              animate={{ y: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 1 }}
            />
          </PaintableShape>

          {/* Nose */}
          <PaintableShape
            selectedColor={selectedColor}
            className="absolute top-30 left-1/2 -translate-x-1/2 w-14 h-8 bg-white border-1 border-black rounded-full"
          />
          {/* Mouth + Teeth */}
          <div className="absolute top-36 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-14 h-1  rounded-full"></div>
            <div className="flex gap-1 mt-1">
              <div className="w-6 h-8 bg-white border-2 border-gray-800 rounded-b-md"></div>
              <div className="w-6 h-8 bg-white border-2 border-gray-800 rounded-b-md"></div>
            </div>
          </div>

          {/* Whiskers */}
          <div className="absolute top-36 left-10 flex flex-col gap-1">
            <div className="w-10 h-0.5 bg-gray-800 rotate-12"></div>
            <div className="w-10 h-0.5 bg-gray-800"></div>
            <div className="w-10 h-0.5 bg-gray-800 -rotate-12"></div>
          </div>
          <div className="absolute top-36 right-10 flex flex-col gap-1 items-end">
            <div className="w-10 h-0.5 bg-gray-800 -rotate-12"></div>
            <div className="w-10 h-0.5 bg-gray-800"></div>
            <div className="w-10 h-0.5 bg-gray-800 rotate-12"></div>
          </div>

          {/* Cheeks */}
          <div className="absolute top-30 left-8 w-6 h-4 bg-pink-300 rounded-full opacity-70"></div>
          <div className="absolute top-30 right-8 w-6 h-4 bg-pink-300 rounded-full opacity-70"></div>
        </PaintableShape>
      </div>
    </div>
  );
};

const Fish = ({ selectedColor, width, height }: ShapeProps) => {
  return (
    <div
      className={`w-${width} h-${height} relative flex items-center justify-center mx-auto`}
    >
      {/* === Fish Body === */}
      <PaintableShape
        selectedColor={selectedColor}
        className="relative w-[70%] h-[60%] bg-white border-4 border-black rounded-full shadow-lg"
      >
        {/* === Tail Fin (Triangle) === */}
        <motion.div
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute -left-25 top-1/2 -translate-y-1/2 "
        >
          {/* Border layer */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(100% 50%, 0% 0%, 0% 100%)",
              backgroundColor: "black",
              transform: "scale(1.05)", // makes it slightly larger → acts like a border
              zIndex: 0,
            }}
          ></div>
          <PaintableShape
            selectedColor={selectedColor}
            className="z-10 w-24 h-24 border-4 bg-white"
            style={{
              clipPath: "polygon(100% 50%, 0% 0%, 0% 100%)",
            }}
          />
        </motion.div>

        {/* === Top Fin === */}
        <motion.div
          animate={{ rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute -top-10 left-[45%]"
        >
          <PaintableShape
            selectedColor={selectedColor}
            className="w-20 h-10 bg-white border-4 border-black rounded-t-full"
          />
        </motion.div>

        {/* === Bottom Fin === */}
        <motion.div
          animate={{ rotate: [0, -5, 0] }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-12 left-[45%]"
        >
          <PaintableShape
            selectedColor={selectedColor}
            className="w-20 h-10 bg-white border-4 border-black rounded-b-full"
          />
        </motion.div>
        {/* Decorative spots */}
        <PaintableShape
          selectedColor={selectedColor}
          className="absolute top-[35%] left-[30%] w-16 h-16 border-4 border-black rounded-full bg-white opacity-90"
        />
        <PaintableShape
          selectedColor={selectedColor}
          className="absolute top-[35%] left-[55%] w-12 h-12 border-4 border-black rounded-full bg-white opacity-80"
        />

        {/* Eye */}
        <div className="absolute top-[35%] right-[15%] w-10 h-10 bg-black rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>

        {/* Mouth */}
        <div className="absolute top-[60%] right-[5%] w-4 h-2 border-b-4 border-black rounded-full"></div>
      </PaintableShape>
    </div>
  );
};

const shapes = [
  {
    value: Car, // {gameState.moves}
    label: "Car",
    color: "blue",
    image: "/assets/ColorBookCar.PNG",
  },
  {
    value: Ship, // {gameState.matches}/{totalPairs}
    label: "Ship",
    color: "green",
    image: "/assets/ColorBookShip.PNG",
  },
  {
    value: Butterfly, // Level {gameState.level}
    label: "Butterfly",
    color: "purple",
    image: "/assets/ColorBookButterfly.PNG",
  },
  {
    value: Rabbit, // Level {gameState.level}
    label: "Rabbit",
    color: "blue",
    image: "/assets/ColorBookRabbit.PNG",
  },
  {
    value: Fish, // Level {gameState.level}
    label: "Fish",
    color: "green",
    image: "/assets/ColorBookFish.PNG",
  },
  {
    value: Icecream, // Level {gameState.level}
    label: "Ice cream",
    color: "purple",
    image: "/assets/ColorBookIcecream.PNG",
  },
];

export default function ColoringGame({
  setIsPlayingColorBookGame,
  onClose,
}: any) {
  const isMdUp = useIsMdUp();
  const [selectedColor, setSelectedColor] = useState("#FF6B6B");
  const [currentShape, setCurrentShape] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const pathname = usePathname();

  const CurrentShapeComponent = shapes[currentShape].value;

  useEffect(() => {
    setShowTips(false);
  }, [isMdUp]);

  const nextShape = () => {
    setCurrentShape((prev) => (prev + 1) % shapes.length);
  };

  const prevShape = () => {
    setCurrentShape((prev) => (prev - 1 + shapes.length) % shapes.length);
  };

  const toggleTips = () => {
    setShowTips(!showTips);
  };

  const getColorClasses = (color: string) => {
    const colorMap: any = {
      blue: "border-blue-400 text-blue-600 bg-blue-50",
      green: "border-green-400 text-green-600 bg-green-50",
      purple: "border-purple-400 text-purple-600 bg-purple-50",
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <>
      {!isMdUp && (
        <button
          onClick={toggleTips}
          className="absolute top-20 z-50 text-xl rounded-xl border-4 bg-red-400 p-2"
        >
          💡 <span className="font-bold">Tips:</span>
        </button>
      )}
      <div className="h-full w-full bg-gradient-to-b from-yellow-100 to-orange-100 rounded-3xl border-4 border-yellow-400 p-6">
        <div className="mx-auto h-full flex flex-col w-full">
          <div className="flex justify-between lg:justify-center ">
            <button
              className="block lg:hidden text-white font-bold rounded-xl bg-green-500 p-3 py-0"
              onClick={prevShape}
            >
              Prev
            </button>
            <div className="text-center mb-4">
              <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-2">
                Color Book
              </h1>
            </div>
            <button
              className="block lg:hidden text-white font-bold rounded-xl bg-green-500 p-3 py-0"
              onClick={nextShape}
            >
              Next
            </button>
          </div>

          <div className="flex flex-col-reverse lg:flex-row gap-3 h-full w-full">
            {/* Left Panel - Instructions & Controls */}
            {(showTips || isMdUp) && (
              <div
                className={`${
                  !isMdUp ? "w-full" : "w-1/3"
                } bg-white rounded-3xl p-3 px-5 shadow-2xl border-4 border-blue-400`}
              >
                <div className="space-y-3">
                  {/* Carousel */}
                  <div className="bg-gray-50 h-80 rounded-2xl p-4 border-2 border-gray-200">
                    <div className="relative h-full">
                      {/* Carousel Navigation */}
                      <div className="flex items-center justify-between mb-3">
                        <button
                          onClick={prevShape}
                          className="w-8 h-8 flex items-center justify-center bg-white text-black text-2xl font-bold rounded-full shadow-md border border-gray-800 hover:bg-gray-100 transition-colors"
                        >
                          {"<"}
                        </button>

                        <div className="flex space-x-1">
                          {shapes.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentShape(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentShape
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                              }`}
                            />
                          ))}
                        </div>

                        <button
                          onClick={nextShape}
                          className="w-8 h-8 flex items-center justify-center bg-white text-black text-2xl font-bold rounded-full shadow-md border border-gray-800 hover:bg-gray-100 transition-colors"
                        >
                          {">"}
                        </button>
                      </div>

                      {/* Carousel Content */}
                      <div className="overflow-hidden h-[90%]">
                        <div
                          className="flex h-full transition-transform duration-300 ease-in-out"
                          style={{
                            transform: `translateX(-${currentShape * 100}%)`,
                          }}
                        >
                          {shapes.map((shape, index) => (
                            <div
                              key={index}
                              className="relative w-full flex-shrink-0"
                            >
                              <div
                                className={`h-full rounded-2xl p-4 shadow-lg border-2 ${getColorClasses(
                                  shape.color
                                )}`}
                                style={{
                                  backgroundImage: `url(${shape.image})`,
                                  backgroundSize: "100%",
                                  backgroundRepeat: "no-repeat",
                                }}
                              >
                                <div className="absolute inset-0 top-[80%] text-2xl font-bold text-center mb-0">
                                  {shape.label}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Controls */}
                  <div className="space-y-3">
                    <button
                      onClick={
                        pathname.includes("play")
                          ? () => onClose && onClose()
                          : () => setIsPlayingColorBookGame(false)
                      }
                      className="w-full py-2 md:py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                    >
                      {pathname.includes("play")
                        ? "Back to games"
                        : "Back to learning"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!showTips && (
              <div className="flex-1">
                <div className="relative h-[100%] mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-3 border-green-400 shadow-lg">
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="absolute z-50 w-24 h-24 left-0 cursor-pointer border-4 border-gray-200 shadow-lg transform hover:scale-105 transition-transform"
                  />
                  <div className="flex h-full flex-col items-center bg-white ">
                    <CurrentShapeComponent
                      selectedColor={selectedColor}
                      width="full"
                      height="full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
