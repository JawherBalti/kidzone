import useIsMdUp from "@/app/hooks/useIsMdUp";
import { useState } from "react";

// Base shape component with common functionality
const PaintableShape = ({ selectedColor, children, className = "" }: any) => {
    const [bgColor, setBgColor] = useState("white");

    const handlePaint = () => {
        setBgColor(selectedColor);
    };

    return (
        <div
            onClick={handlePaint}
            className={`cursor-pointer transition-colors duration-200 ${className}`}
            style={{ backgroundColor: bgColor }}
        >
            {children}
        </div>
    );
};

// Complex shapes for kids
// const Car = ({ selectedColor }: any) => (
//     <div className="relative cursor-pointer w-32 h-20">
//         {/* Car body - main paintable area */}
//         <PaintableShape
//             selectedColor={selectedColor}
//             className="w-full h-12 rounded-lg border-3 border-black absolute bottom-0"
//         />
//         {/* Car top */}
//         <div className="absolute top-0 left-4 w-24 h-8 bg-gray-200 border-3 border-black rounded-t-lg">
//             {/* Windows */}
//             <div className="absolute top-1 left-1 w-10 h-4 bg-blue-300 border-1 border-black rounded-sm"></div>
//             <div className="absolute top-1 right-1 w-10 h-4 bg-blue-300 border-1 border-black rounded-sm"></div>
//         </div>
//         {/* Wheels */}
//         <div className="absolute -bottom-1 left-3 w-6 h-6 bg-gray-700 border-2 border-black rounded-full"></div>
//         <div className="absolute -bottom-1 right-3 w-6 h-6 bg-gray-700 border-2 border-black rounded-full"></div>
//         {/* Headlights */}
//         <div className="absolute bottom-2 left-2 w-2 h-2 bg-yellow-300 border-1 border-black rounded-full"></div>
//     </div>
// );

const Flower = ({ selectedColor }) => (
    <div className="relative cursor-pointer flex flex-col items-center w-24 h-32">
        {/* Stem */}
        <div className="w-2 h-16 bg-green-600 border-2 border-green-800"></div>
        {/* Leaves */}
        <div className="absolute top-8 -left-2 w-4 h-3 bg-green-500 border-1 border-green-700 rounded-full rotate-45"></div>
        <div className="absolute top-12 -right-2 w-4 h-3 bg-green-500 border-1 border-green-700 rounded-full rotate-45"></div>
        {/* Flower head with multiple petals */}
        <div className="absolute -top-2 flex items-center justify-center w-20 h-20">
            {/* Back petals */}
            <PaintableShape
                selectedColor={selectedColor}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full border-3 border-black"
            ></PaintableShape>
            <PaintableShape
                selectedColor={selectedColor}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full border-3 border-black"
            ></PaintableShape>
            <PaintableShape
                selectedColor={selectedColor}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full border-3 border-black"
            ></PaintableShape>
            <PaintableShape
                selectedColor={selectedColor}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full border-3 border-black"
            ></PaintableShape>
            {/* Front petals */}
            <PaintableShape
                selectedColor={selectedColor}
                className="absolute top-2 left-2 w-8 h-8 rounded-full border-3 border-black rotate-45"
            ></PaintableShape>
            <PaintableShape
                selectedColor={selectedColor}
                className="absolute top-2 right-2 w-8 h-8 rounded-full border-3 border-black -rotate-45"
            ></PaintableShape>
            <PaintableShape
                selectedColor={selectedColor}
                className="absolute bottom-2 left-2 w-8 h-8 rounded-full border-3 border-black -rotate-45"
            ></PaintableShape>
            <PaintableShape
                selectedColor={selectedColor}
                className="absolute bottom-2 right-2 w-8 h-8 rounded-full border-3 border-black rotate-45"
            ></PaintableShape>
            {/* Center */}
            <div className="absolute w-12 h-12 bg-yellow-400 border-3 border-black rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full border-2 border-yellow-700"></div>
            </div>
        </div>
    </div>
);

const Sun = ({ selectedColor }) => (
    <div className="relative cursor-pointer w-24 h-24 flex items-center justify-center">
        {/* Sun center */}
        <PaintableShape
            selectedColor={selectedColor}
            className="w-16 h-16 rounded-full border-4 border-yellow-700"
        />
        {/* Sun rays */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-6 bg-yellow-400 border-2 border-yellow-600 rounded-full"></div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-6 bg-yellow-400 border-2 border-yellow-600 rounded-full"></div>
        <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-6 h-3 bg-yellow-400 border-2 border-yellow-600 rounded-full"></div>
        <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-6 h-3 bg-yellow-400 border-2 border-yellow-600 rounded-full"></div>
        {/* Diagonal rays */}
        <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-400 border-2 border-yellow-600 rotate-45 rounded-sm"></div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 border-2 border-yellow-600 rotate-45 rounded-sm"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-yellow-400 border-2 border-yellow-600 rotate-45 rounded-sm"></div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 border-2 border-yellow-600 rotate-45 rounded-sm"></div>
        {/* Face */}
        <div className="absolute top-4 left-5 w-2 h-1 bg-black rounded-full"></div>
        <div className="absolute top-4 right-5 w-2 h-1 bg-black rounded-full"></div>
        <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-3 border-black rounded-full"></div>
    </div>
);

const House = ({ selectedColor }) => (
    <div className="relative cursor-pointer w-28 h-32">
        {/* Main house */}
        <PaintableShape
            selectedColor={selectedColor}
            className="w-24 h-20 border-4 border-black absolute bottom-0"
        />
        {/* Roof */}
        <div className="absolute -top-6 left-0 w-0 h-0 border-l-14 border-r-14 border-b-8 border-transparent border-b-red-600">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-12 border-r-12 border-b-6 border-transparent border-b-red-700"></div>
        </div>
        {/* Door */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-12 bg-brown-600 border-3 border-black rounded-t-sm">
            <div className="absolute top-1/2 left-1 w-1 h-1 bg-yellow-300 rounded-full"></div>
        </div>
        {/* Windows */}
        <div className="absolute top-4 left-3 w-5 h-5 bg-blue-200 border-2 border-black rounded-sm">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black"></div>
            <div className="absolute left-1/2 top-0 w-0.5 h-full bg-black"></div>
        </div>
        <div className="absolute top-4 right-3 w-5 h-5 bg-blue-200 border-2 border-black rounded-sm">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black"></div>
            <div className="absolute left-1/2 top-0 w-0.5 h-full bg-black"></div>
        </div>
        {/* Chimney */}
        <div className="absolute -top-4 right-6 w-3 h-6 bg-red-700 border-2 border-black"></div>
    </div>
);

const Ball = ({ selectedColor }) => (
    <div className="relative cursor-pointer w-20 h-20">
        <PaintableShape
            selectedColor={selectedColor}
            className="w-full h-full rounded-full border-4 border-black"
        >
            {/* Soccer ball pattern */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-black transform -translate-y-1/2"></div>
            <div className="absolute left-1/2 top-0 h-full w-1 bg-black transform -translate-x-1/2"></div>
            <div className="absolute top-1/4 left-1/4 w-8 h-8 border-2 border-black rounded-full transform -rotate-45"></div>
        </PaintableShape>
        {/* Shine effect */}
        <div className="absolute top-3 left-3 w-3 h-3 bg-white bg-opacity-50 rounded-full"></div>
    </div>
);

const Tree = ({ selectedColor }) => (
    <div className="relative cursor-pointer flex flex-col items-center w-20 h-32">
        {/* Trunk */}
        <div className="w-4 h-16 bg-brown-600 border-2 border-brown-800 rounded-b-sm"></div>
        {/* Tree leaves - multiple layers */}
        <div className="absolute -top-2 flex flex-col items-center">
            {/* Bottom layer - largest */}
            <PaintableShape
                selectedColor={selectedColor}
                className="w-20 h-12 rounded-full border-3 border-green-800 mb-1"
            ></PaintableShape>
            {/* Middle layer */}
            <PaintableShape
                selectedColor={selectedColor}
                className="w-16 h-10 rounded-full border-3 border-green-800 mb-1"
            ></PaintableShape>
            {/* Top layer */}
            <PaintableShape
                selectedColor={selectedColor}
                className="w-12 h-8 rounded-full border-3 border-green-800"
            ></PaintableShape>
        </div>
        {/* Ground */}
        <div className="absolute -bottom-4 left-0 w-full h-2 bg-green-600 border-1 border-green-800 rounded-sm"></div>
    </div>
);

const Fish = ({ selectedColor }) => (
    <div className="relative cursor-pointer w-24 h-16">
        {/* Fish body */}
        <PaintableShape
            selectedColor={selectedColor}
            className="w-20 h-12 rounded-full border-3 border-black absolute left-0"
        />
        {/* Tail */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <div className="w-0 h-0 border-t-6 border-b-6 border-l-8 border-transparent border-l-blue-300"></div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-10 border-transparent border-l-blue-500"></div>
        </div>
        {/* Eye */}
        <div className="absolute top-3 left-4 w-3 h-3 bg-white border-2 border-black rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-black rounded-full"></div>
        </div>
        {/* Fins */}
        <div className="absolute top-1 left-6 w-3 h-2 bg-blue-300 border-1 border-black rounded-full"></div>
        <div className="absolute bottom-1 left-6 w-3 h-2 bg-blue-300 border-1 border-black rounded-full"></div>
        {/* Mouth */}
        <div className="absolute bottom-4 left-2 w-2 h-1 bg-black rounded-full"></div>
        {/* Bubbles */}
        <div className="absolute -top-2 left-10 w-2 h-2 bg-blue-200 border-1 border-blue-400 rounded-full"></div>
        <div className="absolute -top-4 left-14 w-1 h-1 bg-blue-200 border-1 border-blue-400 rounded-full"></div>
    </div>
);

const Butterfly = ({ selectedColor, height = 500, width = 500 }) => {
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

const IceCream = ({ selectedColor }) => (
    <div className="relative cursor-pointer flex flex-col items-center w-16 h-24">
        {/* Cone */}

        {/* Scoops */}
        <PaintableShape
            selectedColor={selectedColor}
            className="w-10 h-6 rounded-full border-3 border-black"
        ></PaintableShape>
        <PaintableShape
            selectedColor={selectedColor}
            className="w-12 h-8 rounded-full border-3 border-black -mb-1"
        ></PaintableShape>
        <PaintableShape
            selectedColor={selectedColor}
            className="w-14 h-10 rounded-full border-3 border-black -mb-2"
        ></PaintableShape>
        {/* Cherry */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-600 border-2 border-red-800 rounded-full">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-green-600 rounded-full"></div>
        </div>
        <div
            className="w-12 h-16 bg-yellow-600 border-3 border-yellow-800 rounded-b-lg"
            style={{ clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)" }}
        ></div>
    </div>
);

const Car = ({ selectedColor, width = 260, height = 140 }) => {
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

export default function ColoringGame() {
    const [selectedColor, setSelectedColor] = useState("#FF6B6B");
    const isMdUp = useIsMdUp();

    return (
        <div className="h-full w-full bg-gradient-to-b from-yellow-100 to-orange-100 rounded-3xl border-4 border-yellow-400 p-6">
            <div className="mx-auto h-full flex flex-col w-full">
                <div className="text-center mb-4">
                    <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-2">
                        Color Book
                    </h1>
                </div>

                <div className="flex flex-col-reverse lg:flex-row gap-3 h-full w-full">
                    {/* Left Panel - Instructions & Controls */}
                    {isMdUp && (
                        <div
                            className={`${
                                !isMdUp ? "w-full " : "w-1/3"
                            } bg-white rounded-3xl p-3 px-5 shadow-2xl border-4 border-blue-300`}
                        >
                            <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
                                How to Play
                            </h2>

                            <div className="space-y-3">
                                {/* Instructions */}
                                <div className="bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-200">
                                    <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                                        🎯 Instructions:
                                    </h3>
                                    <ul className="text-sm text-yellow-700 space-y-2">
                                        <li>• Click cards to flip them over</li>
                                        <li>• Find matching animal pairs</li>
                                        <li>
                                            • Match all pairs to complete the
                                            level
                                        </li>
                                        <li>
                                            • Learn fun facts about each animal!
                                        </li>
                                    </ul>
                                </div>

                                {/* Stats */}
                                <div className="flex justify-center gap-6">
                                    <div className="bg-white rounded-2xl p-3 shadow-lg border-2 border-blue-400">
                                        <div className="text-md font-bold text-center text-blue-600">
                                            {/* {gameState.moves} */}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Moves
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-2xl p-3 shadow-lg border-2 border-green-400">
                                        <div className="text-md font-bold text-center text-green-600">
                                            {/* {gameState.matches}/{totalPairs} */}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Matches
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-2xl p-3 shadow-lg border-2 border-purple-400">
                                        <div className="text-md font-bold text-center text-purple-600">
                                            {/* Level {gameState.level} */}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Difficulty
                                        </div>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="space-y-3">
                                    <button
                                        // onClick={handleRestart}
                                        className="w-full py-2 md:py-3 bg-gradient-to-r from-pink-600 to-orange-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                                    >
                                        Reset
                                    </button>

                                    <button
                                        // onClick={() =>
                                        //     setIsPlayingAnimalMemoryGame(
                                        //         false
                                        //     )
                                        // }
                                        className="w-full py-2 md:py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white text-md rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                                    >
                                        Back to learning
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex-1">
                        <div className="relative h-[100%] mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-3 border-orange-200 shadow-lg">
                            <input
                                type="color"
                                value={selectedColor}
                                onChange={(e) =>
                                    setSelectedColor(e.target.value)
                                }
                                className="absolute z-50 w-24 h-24 cursor-pointer border-4 border-gray-200 rounded-2xl shadow-lg transform hover:scale-105 transition-transform"
                            />
                            <div className="flex h-full flex-col items-center bg-white ">
                                {/* <Butterfly
                                    selectedColor={selectedColor}
                                    height="full"
                                    width="full"
                                /> */}
                                <Car
                                    selectedColor={selectedColor}
                                    height="full"
                                    width="full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shapes Grid */}
                {/* <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
                    {[
                        {
                            component: <Car selectedColor={selectedColor} />,
                            name: "Car 🚗",
                        },
                        {
                            component: <Flower selectedColor={selectedColor} />,
                            name: "Flower 🌸",
                        },
                        {
                            component: <Sun selectedColor={selectedColor} />,
                            name: "Sun ☀️",
                        },
                        {
                            component: <House selectedColor={selectedColor} />,
                            name: "House 🏠",
                        },
                        {
                            component: <Ball selectedColor={selectedColor} />,
                            name: "Ball ⚽",
                        },
                        {
                            component: <Tree selectedColor={selectedColor} />,
                            name: "Tree 🌳",
                        },
                        {
                            component: <Fish selectedColor={selectedColor} />,
                            name: "Fish 🐠",
                        },
                        {
                            component: (
                                <Butterfly selectedColor={selectedColor} />
                            ),
                            name: "Butterfly 🦋",
                        },
                        {
                            component: (
                                <IceCream selectedColor={selectedColor} />
                            ),
                            name: "Ice Cream 🍦",
                        },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center p-4 bg-white rounded-xl border-3 border-gray-200 shadow-md hover:shadow-lg transition-shadow"
                        >
                            <p className="mb-3 font-bold text-lg text-gray-800">
                                {item.name}
                            </p>
                            {item.component}
                        </div>
                    ))}
                </div> */}
            </div>
        </div>
    );
}
