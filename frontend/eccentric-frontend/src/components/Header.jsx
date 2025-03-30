import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full top-0 left-0 z-50 transition-all ${
        scrolling ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/">
          <motion.img
            src="/assets/images/Logo2.png"
            alt="Logo2"
            className="h-16 rounded-2xl"
            whileHover={{ scale: 1.1 }}
          />
        </Link>

        {/* Navigation Links */}
        <nav className="flex space-x-6">
          <Link
            to="/about"
            className="text-white hover:text-gray-300 transition duration-300"
          >
            About
          </Link>
          <Link
            to="/variants"
            className="text-white hover:text-gray-300 transition duration-300"
          >
            Variants
          </Link>
          <Link
            to="/contact"
            className="text-white hover:text-gray-300 transition duration-300"
          >
            Contact
          </Link>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
