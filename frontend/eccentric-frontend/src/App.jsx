import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import VariantPage from "./pages/VariantPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/variant/:id" element={<VariantPage />} />
      </Routes>
    </Router>
  );
}

export default App;
