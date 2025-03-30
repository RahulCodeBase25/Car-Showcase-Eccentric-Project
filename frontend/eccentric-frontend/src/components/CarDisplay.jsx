import { useState } from "react";
import { motion } from "framer-motion";

const CarDisplay = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <motion.div
        className="overflow-hidden rounded-2xl shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="relative w-full h-96 cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered ? (
            <video
              src="/assets/videos/Car1.mp4"
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="/assets/images/HeroImage.png"
              alt="Car1"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CarDisplay;
