// Contact.jsx - Contact Page
import { useState } from "react";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted: ", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-6 py-12 text-center">
        
        <motion.h1 
          className="text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Contact Us
        </motion.h1>

        <p className="text-gray-600 mb-6">We'd love to hear from you! Reach out to us using the form below.</p>

        <motion.div 
          className="flex flex-wrap justify-center gap-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          
          <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow-lg">
            <FaPhone className="text-blue-500 text-xl" />
            <span>+91 79778 54654</span> 
          </div>
          <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow-lg">
            <FaEnvelope className="text-red-500 text-xl" />
            <span>Rahul.Codecraft@gmail.com</span>
          </div>
          <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow-lg">
            <FaMapMarkerAlt className="text-green-500 text-xl" />
            <span>Mumbai, India</span>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block text-left font-semibold">Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-left font-semibold">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-left font-semibold">Message</label>
            <textarea 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              required
            ></textarea>
          </div>
          <motion.button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send Message
          </motion.button>
        </form>

        {submitted && (
          <motion.p 
            className="mt-4 text-green-600 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Message sent successfully!
          </motion.p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
