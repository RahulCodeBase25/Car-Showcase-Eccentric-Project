import { useState } from "react";
import { motion } from "framer-motion";

const variants = [
  {
    id: 1,
    name: "Standard",
    models: [
      {
        name: "Model A",
        colors: [
          { name: "Red", image: "/assets/images/StandardRedcar.png" },
          { name: "Blue", image: "/assets/images/StandardBluecar.png" },
          { name: "Black", image: "/assets/images/StandardBlackcar.png" },
        ],
        features: ["Basic Sound System", "Cloth Seats"],
      },
    ],
  },
  {
    id: 2,
    name: "Premium",
    models: [
      {
        name: "Model B",
        colors: [
          { name: "Silver", image: "/assets/images/PremiumSilver.png" },
          { name: "White", image: "/assets/images/PremiumWhite.png" },
          { name: "Gray", image: "/assets/images/PremiumGrey.png" },
        ],
        features: ["Bose Audio", "Leather Seats", "Sunroof"],
      },
    ],
  },
  {
    id: 3,
    name: "Sports",
    models: [
      {
        name: "Model C",
        colors: [
          { name: "Yellow", image: "/assets/images/SportsYellow.png" },
          { name: "Green", image: "/assets/images/SportsGreen.png" },
          { name: "Orange", image: "/assets/images/SportsOrange.png" },
        ],
        features: ["Performance Tires", "Carbon Fiber Trim"],
      },
    ],
  },
];

const VariantPage = () => {
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [selectedModel, setSelectedModel] = useState(variants[0].models[0]);
  const [selectedColor, setSelectedColor] = useState(variants[0].models[0].colors[0]);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleColorChange = (color) => {
    setIsFlipping(true);
    setTimeout(() => {
      setSelectedColor(color);
      setIsFlipping(false);
    }, 300);
  };

  return (
    <motion.div
      className="min-h-screen p-10 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl font-bold text-center mb-6">Choose Your Variant</h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8">
        <div className="flex flex-col gap-4">
          {variants.map((variant) => (
            <motion.button
              key={variant.id}
              className={`p-4 w-60 border rounded-xl shadow-lg text-lg font-semibold cursor-pointer transition-all duration-300 ${
                selectedVariant.id === variant.id ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800"
              }`}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setSelectedVariant(variant);
                setSelectedModel(variant.models[0]);
                setSelectedColor(variant.models[0].colors[0]);
              }}
            >
              {variant.name}
            </motion.button>
          ))}
        </div>
        <motion.div
          className="w-96 h-auto rounded-lg shadow-lg"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: isFlipping ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <img src={selectedColor.image} alt={selectedColor.name} className="w-full h-auto rounded-lg" />
        </motion.div>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-semibold">Available Colors</h2>
        <div className="flex gap-4 mt-3">
          {selectedModel.colors.map((color) => (
            <motion.button
              key={color.name}
              className={`p-3 border rounded-full cursor-pointer transition-all duration-300 ${
                selectedColor.name === color.name ? "bg-gray-800 text-white" : "bg-white dark:bg-gray-700"
              }`}
              whileHover={{ scale: 1.1 }}
              onClick={() => handleColorChange(color)}
            >
              {color.name}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-semibold">Features</h2>
        <ul className="list-disc pl-5">
          {selectedModel.features.map((feature, index) => (
            <li key={index} className="text-lg">{feature}</li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex justify-center text-red-700">
        <button
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
          onClick={() => alert("Booking feature coming soon!")}
        >
          Book Now
        </button>
      </div>
    </motion.div>
  );
};

export default VariantPage;
