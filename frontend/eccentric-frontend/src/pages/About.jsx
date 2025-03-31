import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Header />
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col items-center justify-center text-center p-8"
      >
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="max-w-2xl text-lg opacity-80">
          Welcome to our virtual showroom! We bring you a seamless and interactive experience
          to explore the latest car models with dynamic visuals, real-time color selections,
          and smooth animations.
        </p>
      </motion.section>
      <Footer />
    </div>
  );
};

export default About;
