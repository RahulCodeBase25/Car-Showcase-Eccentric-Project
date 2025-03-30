import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      className="bg-gray-900 text-white py-6 px-4 mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">© 2025 Eccentric Cars. All rights reserved.</p>

        <div className="flex space-x-4 mt-3 md:mt-0">
          <a href="#" className="hover:text-blue-400 transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-blue-400 transition">
            Terms of Service
          </a>
          <a href="#" className="hover:text-blue-400 transition">
            Contact
          </a>
        </div>

        <div className="flex space-x-4 mt-3 md:mt-0">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/rahul-singh-full-stack/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition transform"
          >
            <img
              src="/assets/images/linkedin.png"
              alt="LinkedIn"
              className="w-6 h-6"
            />
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/RahulCodeBase25"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition transform"
          >
            <img
              src="/assets/images/Github.png"
              alt="Github"
              className="w-6 h-6"
            />
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/rahul_chingzzz/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition transform"
          >
            <img
              src="/assets/images/Instalogo.png"
              alt="Instagram"
              className="w-6 h-6 rounded-2xl"
            />
          </a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
