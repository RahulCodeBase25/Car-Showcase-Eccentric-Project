import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import About from "../pages/About";
import Contact from "../pages/Contact";
import VariantPage from "../pages/VariantPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/variants" element={<VariantPage />} />
    </Routes>
  );
};

export default AppRoutes;
