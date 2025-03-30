import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import VariantPage from "./pages/VariantPage";
import ModelSelector from "./components/ModelSelector"; // Import ModelSelector

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/models" element={<ModelSelector />} /> {/* Added ModelSelector Route */}
      <Route path="/variants" element={<VariantPage />} />
    </Routes>
  );
};

export default RoutesComponent;
