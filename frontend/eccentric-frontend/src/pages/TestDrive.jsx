import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import CarArt from "../components/CarArt";
import { Loading, ErrorState } from "../components/States";
import { useCatalog } from "../store/useCatalog";
import { api } from "../lib/api";
import { niceDate } from "../lib/format";

function Step({ n, title, children }) {
  return (
    <fieldset className="min-w-0 border-t border-line py-8">
      <legend className="sr-only">{title}</legend>
      <h2 className="mb-5 text-xl font-semibold" aria-hidden="true">
        <span className="mr-2 font-display text-muted">{n}</span>
        {title}
      </h2>
      {children}
    </fieldset>
  );
}

// A calendar file for the booking, made in the browser
function icsFor(b) {
  const [h, m] = b.slot.split(":").map(Number);
  const pad = (x) => String(x).padStart(2, "0");
  const start = `${b.date.replaceAll("-", "")}T${pad(h)}${pad(m)}00`;
  const endMin = h * 60 + m + 45;
  const end = `${b.date.replaceAll("-", "")}T${pad(Math.floor(endMin / 60))}${pad(endMin % 60)}00`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Eccentric Motors//Test drive//EN",
    "BEGIN:VEVENT",
    `UID:${b.ref}@eccentric-motors`,
    `DTSTART;TZID=America/Chicago:${start}`,
    `DTEND;TZID=America/Chicago:${end}`,
    `SUMMARY:Eccentric ${b.modelName} test drive`,
    `LOCATION:Eccentric Motors ${b.location}`,
    `DESCRIPTION:Booking ${b.ref}. Bring your driving licence.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function Confirmation({ booking, onReset }) {
  const href = URL.createObjectURL(new Blob([icsFor(booking)], { type: "text/calendar" }));
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl rounded-[2rem] bg-ink p-8 text-paper sm:p-12">
      <p className="eyebrow !text-[#a3a29b]">Booked · {booking.ref}</p>
      <h1 className="display mt-3 text-[clamp(2rem,6vw,3.4rem)]">See you there, {booking.name.split(" ")[0]}.</h1>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          ["Car", `Eccentric ${booking.modelName}`],
          ["Showroom", booking.location],
          ["Day", niceDate(booking.date)],
          ["Time", `${booking.slot}, 45 minutes`],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-sm text-[#a3a29b]">{k}</dt>
            <dd className="mt-0.5 text-lg font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 text-sm text-[#bdbcb5]">This is a demo, so no email is sent. Keep your booking reference.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href={href} download={`test-drive-${booking.ref}.ics`} className="btn btn-accent">
          Add to calendar
        </a>
        <button onClick={onReset} className="btn border-[1.5px] border-paper hover:bg-paper hover:text-ink">
          Book another
        </button>
      </div>
    </motion.div>
  );
}

export default function TestDrive() {
  const [params] = useSearchParams();
  const { models, status, error, load } = useCatalog();
  const [options, setOptions] = useState(null);
  const [optionsError, setOptionsError] = useState(null);
  const [form, setForm] = useState({ model: params.get("model") || "", location: "", date: "", slot: "", name: "", email: "" });
  const [availability, setAvailability] = useState(null);
  const [sending, setSending] = useState(false);
  const [problem, setProblem] = useState(null);
  const [booking, setBooking] = useState(null);
  const buildCode = params.get("build");

  const set = (patch) => {
    setProblem(null);
    setForm((f) => ({ ...f, ...patch }));
  };

  useEffect(() => {
    api("/test-drives/options").then(setOptions).catch((err) => setOptionsError(err.message));
  }, []);

  // Free times for the chosen showroom and day
  useEffect(() => {
    if (!form.location || !form.date) return setAvailability(null);
    let live = true;
    setAvailability(null);
    api(`/test-drives/availability?location=${form.location}&date=${form.date}`)
      .then((a) => live && setAvailability(a))
      .catch((err) => live && setProblem(err.message));
    return () => {
      live = false;
    };
  }, [form.location, form.date, booking]);

  if (status === "error") return <ErrorState message={error} onRetry={load} />;
  if (optionsError) return <ErrorState message={optionsError} onRetry={() => window.location.reload()} />;
  if (status !== "ready" || !options) return <Loading label="Loading test drive times" />;

  if (booking) {
    return (
      <div className="wrap pt-12">
        <Confirmation
          booking={booking}
          onReset={() => {
            setBooking(null);
            setForm((f) => ({ ...f, slot: "" }));
          }}
        />
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    const missing = !form.model ? "Pick a car" : !form.location ? "Pick a showroom" : !form.date ? "Pick a day" : !form.slot ? "Pick a time" : null;
    if (missing) return setProblem(missing);
    setSending(true);
    try {
      const b = await api("/test-drives", { method: "POST", body: { ...form, ...(buildCode ? { buildCode } : {}) } });
      setBooking({ ...b, modelName: models.find((m) => m.slug === form.model)?.name });
      window.scrollTo(0, 0);
    } catch (err) {
      setProblem(err.message);
      if (err.status === 409) setForm((f) => ({ ...f, slot: "" }));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="wrap pt-10">
      <p className="eyebrow">Test drive{buildCode ? ` · build ${buildCode}` : ""}</p>
      <h1 className="display mt-3 max-w-3xl text-[clamp(2.4rem,7vw,4.6rem)]">Take one out for 45 minutes.</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">Pick a car, a showroom and a time. Showrooms are open Monday to Saturday.</p>

      <form onSubmit={submit} className="mt-6 max-w-4xl" noValidate>
        <Step n="01" title="Car">
          <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Car">
            {models.map((m) => (
              <button type="button" key={m.slug} role="radio" aria-checked={form.model === m.slug} onClick={() => set({ model: m.slug })} className="choice p-4">
                <CarArt body={m.body} paint={m.colors[2].hex} wheel={m.wheels[0]} className="w-full" title={m.name} />
                <span className="mt-2 block font-semibold">{m.name}</span>
                <span className="block text-sm text-muted">{m.tagline}</span>
              </button>
            ))}
          </div>
        </Step>

        <Step n="02" title="Showroom">
          <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Showroom">
            {options.locations.map((l) => (
              <button type="button" key={l.id} role="radio" aria-checked={form.location === l.id} onClick={() => set({ location: l.id, slot: "" })} className="choice p-4 font-semibold">
                {l.name}
              </button>
            ))}
          </div>
        </Step>

        <Step n="03" title="Day and time">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2" role="radiogroup" aria-label="Day">
            {options.dates.map((d) => (
              <button
                type="button"
                key={d}
                role="radio"
                aria-checked={form.date === d}
                onClick={() => set({ date: d, slot: "" })}
                className="choice flex w-[4.5rem] shrink-0 flex-col items-center py-3"
              >
                <span className="text-xs text-muted">{niceDate(d, { weekday: "short" })}</span>
                <span className="display text-[1.5rem]">{niceDate(d, { day: "numeric" })}</span>
                <span className="text-xs text-muted">{niceDate(d, { month: "short" })}</span>
              </button>
            ))}
          </div>
          <div className="mt-5">
            {!form.location || !form.date ? (
              <p className="text-sm text-muted">Pick a showroom and a day to see free times.</p>
            ) : !availability ? (
              <p className="text-sm text-muted">Checking free times…</p>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5" role="radiogroup" aria-label="Time">
                {availability.map(({ slot, left }) => (
                  <button
                    type="button"
                    key={slot}
                    role="radio"
                    aria-checked={form.slot === slot}
                    disabled={!left}
                    onClick={() => set({ slot })}
                    className="choice px-2 py-3 text-center disabled:opacity-40"
                  >
                    <span className="block font-semibold tabular-nums">{slot}</span>
                    <span className={`block text-xs ${left === 1 ? "text-accent-ink" : "text-muted"}`}>{left ? `${left} car${left > 1 ? "s" : ""} free` : "Full"}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Step>

        <Step n="04" title="Your details">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Name</span>
              <input className="field" autoComplete="name" value={form.name} onChange={(e) => set({ name: e.target.value })} maxLength={80} required />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Email</span>
              <input className="field" type="email" autoComplete="email" value={form.email} onChange={(e) => set({ email: e.target.value })} maxLength={120} required />
            </label>
          </div>
        </Step>

        <div className="flex flex-wrap items-center gap-4 border-t border-line pt-8">
          <button className="btn btn-accent" disabled={sending}>
            {sending ? "Booking…" : "Book test drive"}
          </button>
          {problem && (
            <p className="text-sm font-medium text-bad" role="alert">
              {problem}
            </p>
          )}
        </div>
        {buildCode && (
          <p className="mt-4 text-sm text-muted">
            We'll have your build <Link className="underline" to={`/b/${buildCode}`}>{buildCode}</Link> ready to look at.
          </p>
        )}
      </form>
    </div>
  );
}
