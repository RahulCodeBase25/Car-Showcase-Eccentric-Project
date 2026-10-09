import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CarArt from "../components/CarArt";
import { Loading, ErrorState } from "../components/States";
import { useCatalog, modelBySlug } from "../store/useCatalog";
import { money } from "../lib/format";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: [0.2, 0.7, 0.3, 1] } }),
};

function Hero() {
  const models = useCatalog((s) => s.models);
  const volt = modelBySlug(models, "volt");
  const [paint, setPaint] = useState("#f0bf12");

  return (
    <section className="studio relative overflow-hidden">
      <div className="wrap pt-12 pb-6 sm:pt-20">
        <motion.p variants={fadeUp} initial="hidden" animate="show" className="eyebrow">
          New · Volt grand tourer
        </motion.p>
        <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1} className="display mt-4 max-w-4xl text-[clamp(2.6rem,8vw,6.4rem)]">
          Electric,
          <br />
          with character.
        </motion.h1>
        <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2} className="mt-6 max-w-xl text-lg text-muted">
          Three cars, built your way. Pick the trim, the paint and the wheels, watch the price update as you go, then book a drive at a showroom near you.
        </motion.p>
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="mt-8 flex flex-wrap gap-3">
          <Link to="/build/volt" className="btn btn-dark">
            Build your Volt
          </Link>
          <Link to="/test-drive?model=volt" className="btn btn-ghost">
            Book a test drive
          </Link>
        </motion.div>
      </div>

      <div className="wrap relative">
        <motion.div initial={{ x: "70%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1.6, ease: [0.2, 0.7, 0.3, 1], delay: 0.2 }}>
          <CarArt body="coupe" paint={paint} wheel={{ style: "turbine", finish: "#2a2c30" }} spinning className="mx-auto w-full max-w-5xl" title="Eccentric Volt" />
        </motion.div>
        {volt && (
          <div className="flex flex-wrap items-center justify-center gap-3 pb-10" role="radiogroup" aria-label="Try a colour">
            {volt.colors.map((c) => (
              <button
                key={c.id}
                role="radio"
                aria-checked={paint === c.hex}
                aria-label={c.name}
                title={c.name}
                onClick={() => setPaint(c.hex)}
                className={`h-8 w-8 rounded-full ring-offset-2 ring-offset-paper transition ${paint === c.hex ? "ring-2 ring-ink" : "ring-1 ring-black/15 hover:scale-110"}`}
                style={{ background: c.hex }}
              />
            ))}
            <span className="ml-2 text-sm text-muted">{volt.colors.find((c) => c.hex === paint)?.name}</span>
          </div>
        )}
      </div>
    </section>
  );
}

function Spec({ value, unit, label }) {
  return (
    <div>
      <p className="display text-[1.7rem]">
        {value}
        <span className="ml-1 text-base font-semibold text-muted">{unit}</span>
      </p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

function Lineup() {
  const { models, status, error, load } = useCatalog();
  if (status === "error") return <ErrorState message={error} onRetry={load} />;
  if (status !== "ready") return <Loading label="Loading the cars" />;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {models.map((m, i) => (
        <motion.article
          key={m.slug}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          custom={i}
          className="group flex flex-col rounded-[1.75rem] border border-line bg-card p-6"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="display text-[2.2rem]">{m.name}</h3>
            <p className="text-sm text-muted">From {money(m.basePrice)}</p>
          </div>
          <p className="mt-1 text-muted">{m.tagline}</p>
          <Link to={`/build/${m.slug}`} className="studio -mx-2 mt-5 block rounded-2xl px-2 py-4" aria-label={`Build your ${m.name}`}>
            <CarArt
              body={m.body}
              paint={m.colors[Math.min(2, m.colors.length - 1)].hex}
              wheel={m.wheels[1]}
              className="w-full transition-transform duration-500 group-hover:-translate-x-2"
              title={`Eccentric ${m.name}`}
            />
          </Link>
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-5">
            <Spec value={m.specs.rangeKm} unit="km" label="Range" />
            <Spec value={m.specs.zeroTo100} unit="s" label="0–100 km/h" />
            <Spec value={m.specs.seats} unit="" label="Seats" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={`/build/${m.slug}`} className="btn btn-dark flex-1">
              Build yours
            </Link>
            <Link to={`/test-drive?model=${m.slug}`} className="btn btn-ghost flex-1">
              Test drive
            </Link>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

function Options() {
  const { packages, status } = useCatalog();
  if (status !== "ready") return null;
  return (
    <section className="wrap mt-28">
      <p className="eyebrow">Options</p>
      <h2 className="display mt-3 max-w-3xl text-[clamp(2rem,5vw,3.6rem)]">The extras worth paying for.</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {packages.map((p, i) => (
          <motion.article key={p.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} custom={i}>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-line">
              {p.media.type === "video" ? (
                <video src={p.media.src} poster={p.media.poster} autoPlay loop muted playsInline className="h-full w-full object-cover" aria-label={p.name} />
              ) : (
                <img src={p.media.src} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="shrink-0 text-sm text-muted">{money(p.price)}</p>
            </div>
            <p className="mt-1 text-[0.95rem] text-muted">{p.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    ["Build it", "Choose a trim, paint, wheels and options. The price is worked out on the server as you click."],
    ["Save it", "Get a short code and a link to your build. Send it to someone, or come back to it later."],
    ["Drive it", "Pick a showroom, a day and a time. Each slot has two demo cars, so it can never be double-booked."],
  ];
  return (
    <section className="wrap mt-28">
      <div className="grid gap-10 rounded-[2rem] bg-ink p-8 text-paper sm:p-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="eyebrow !text-[#a3a29b]">How it works</p>
          <h2 className="display mt-3 text-[clamp(2rem,4.5vw,3.2rem)]">From idea to driver's seat.</h2>
          <Link to="/test-drive" className="btn btn-accent mt-8">
            Book a test drive
          </Link>
        </div>
        <ol className="grid gap-8 sm:grid-cols-3">
          {steps.map(([title, text], i) => (
            <li key={title}>
              <p className="display text-[2.4rem] text-accent">0{i + 1}</p>
              <h3 className="mt-2 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-[0.95rem] text-[#bdbcb5]">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <section id="models" className="wrap scroll-mt-20 pt-24">
        <p className="eyebrow">The line-up</p>
        <h2 className="display mt-3 max-w-3xl text-[clamp(2rem,5vw,3.6rem)]">Pick your shape.</h2>
        <div className="mt-10">
          <Lineup />
        </div>
      </section>
      <Options />
      <HowItWorks />
    </>
  );
}
