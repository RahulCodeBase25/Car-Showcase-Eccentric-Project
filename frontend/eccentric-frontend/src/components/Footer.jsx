import { Link } from "react-router-dom";
import { Wordmark } from "./Header";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="wrap grid gap-8 py-12 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-3 max-w-sm text-sm text-muted">
            Eccentric Motors is a made-up car brand. This site is a full-stack portfolio project by{" "}
            <a className="underline underline-offset-2 hover:text-ink" href="https://rahul-dev-portfolio.vercel.app" target="_blank" rel="noreferrer">
              Rahul Singh
            </a>
            .
          </p>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Explore</p>
          <ul className="space-y-2">
            <li><Link className="hover:text-accent-ink" to="/build/aero">Build an Aero</Link></li>
            <li><Link className="hover:text-accent-ink" to="/build/terra">Build a Terra</Link></li>
            <li><Link className="hover:text-accent-ink" to="/build/volt">Build a Volt</Link></li>
            <li><Link className="hover:text-accent-ink" to="/test-drive">Book a test drive</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Project</p>
          <ul className="space-y-2">
            <li><a className="hover:text-accent-ink" href="https://github.com/RahulCodeBase25/Car-Showcase-Eccentric-Project" target="_blank" rel="noreferrer">Source on GitHub</a></li>
            <li><a className="hover:text-accent-ink" href="https://www.linkedin.com/in/rahul-singh-full-stack/" target="_blank" rel="noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
