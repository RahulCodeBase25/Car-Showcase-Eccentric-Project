import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export function Wordmark({ className = "" }) {
  return (
    <span className={`inline-flex items-baseline gap-1.5 ${className}`}>
      <span className="display text-[1.15rem] tracking-[0.06em]">ECCENTRIC</span>
      <span className="eyebrow !text-[0.62rem] !tracking-[0.3em]">Motors</span>
    </span>
  );
}

const links = [
  { to: "/#models", label: "Models" },
  { to: "/build/aero", label: "Build" },
  { to: "/test-drive", label: "Test drive" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`sticky top-0 z-40 transition-colors ${scrolled || open ? "bg-paper/90 backdrop-blur border-b border-line" : "border-b border-transparent"}`}>
      <div className="wrap flex h-16 items-center justify-between">
        <Link to="/" aria-label="Eccentric Motors home">
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-8 text-[0.95rem] font-medium sm:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `hover:text-accent-ink ${isActive && !l.to.includes("#") ? "text-accent-ink" : ""}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button className="sm:hidden -mr-2 p-2" aria-expanded={open} aria-controls="mobile-nav" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className="wrap flex flex-col pb-4 text-lg font-medium sm:hidden" aria-label="Main">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="border-t border-line py-3">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
