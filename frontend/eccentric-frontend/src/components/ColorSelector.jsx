import { motion } from "framer-motion";
import useStore from "../store/useStore";

const colors = [
  { id: 1, name: "Red", code: "#FF0000" },
  { id: 2, name: "Blue", code: "#0000FF" },
  { id: 3, name: "Black", code: "#000000" },
  { id: 4, name: "White", code: "#FFFFFF" },
];

const ColorSelector = () => {
  const { selectedColor, setColor } = useStore(); // Fixed function name

  return (
    <div className="text-center py-6">
      <h2 className="text-3xl font-bold mb-4">Explore Our Vibrant Shades!</h2>
      <div className="flex justify-center gap-6">
        {colors.map((color) => (
          <motion.div
            key={color.id}
            className={`w-14 h-14 rounded-full border-4 cursor-pointer ${
              selectedColor && selectedColor.id === color.id ? "border-blue-500" : "border-gray-300"
            }`}
            style={{ backgroundColor: color.code }}
            whileHover={{ scale: 1.2 }}
            onClick={() => setColor(color)} // Fixed function call
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
