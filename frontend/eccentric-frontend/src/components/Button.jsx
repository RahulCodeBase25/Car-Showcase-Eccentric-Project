import { motion } from "framer-motion";

const Button = ({ text, onClick, className }) => {
  return (
    <motion.button
      className={`px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
    >
      {text}
    </motion.button>
  );
};

export default Button;
