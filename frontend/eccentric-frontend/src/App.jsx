import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import Home from "./pages/Home";
import Configurator from "./pages/Configurator";
import SavedBuild from "./pages/SavedBuild";
import TestDrive from "./pages/TestDrive";
import NotFound from "./pages/NotFound";
import { useCatalog } from "./store/useCatalog";

// New page: start at the top, or at the #section in the link
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) return el.scrollIntoView();
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const load = useCatalog((s) => s.load);
  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <ScrollManager />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/build/:slug" element={<Configurator />} />
          <Route path="/b/:code" element={<SavedBuild />} />
          <Route path="/test-drive" element={<TestDrive />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </>
  );
}
