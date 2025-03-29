import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import VariantPage from "./pages/VariantPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/variant/:id" element={<VariantPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
