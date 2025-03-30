import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import useStore from "../store/useStore";

const carModels = [
  { id: 1, name: "Standard", image: "/assets/images/Car1.png" },
  { id: 2, name: "Premium", image: "/assets/images/Car2.png" },
  { id: 3, name: "Sports", image: "/assets/images/Car3.png" },
];

const ModelSelector = () => {
  const { selectedModel, setModel } = useStore();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleModelSelect = (model) => {
    setModel(model);
    navigate("/variants"); // Redirect to VariantPage
  };

  return (
    <div className="text-center py-6">
      <h2 className="text-3xl font-bold mb-4">Choose Your Model</h2>
      <div className="flex justify-center gap-6">
        {carModels.map((model) => (
          <motion.div
            key={model.id}
            className={`p-4 border-2 rounded-lg cursor-pointer ${
              selectedModel && selectedModel.id === model.id ? "border-blue-500" : "border-gray-300"
            }`}
            whileHover={{ scale: 1.1 }}
            onClick={() => handleModelSelect(model)} // Handle click event
          >
            <img src={model.image} alt={model.name} className="w-32 h-32 object-cover" />
            <p className="mt-2 font-semibold">{model.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;
