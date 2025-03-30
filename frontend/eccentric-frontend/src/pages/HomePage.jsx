import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CarDisplay from "../components/CarDisplay";
import ModelSelector from "../components/ModelSelector";
import ColorSelector from "../components/ColorSelector";
import FeatureSection from "../components/FeatureSection";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto p-4"
      >
        {/* Hero Section */}
        <section className="text-center py-10">
          <motion.h1
            className="text-4xl font-bold mb-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to Car-Showcae by Rahul
          </motion.h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Experience the future of automobiles with our advanced car showcase.
          </p>
        </section>
        
        {/* Car Display */}
        <CarDisplay />

        {/* Model Selector */}
        <ModelSelector />

        {/* Color Selector */}
        <ColorSelector />

        {/* Feature Section */}
        <FeatureSection />
        <Footer />
      </motion.main>
     
    </div>
  );
};

export default HomePage;