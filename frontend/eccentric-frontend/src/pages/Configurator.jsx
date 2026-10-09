import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import CarArt, { WheelPreview } from "../components/CarArt";
import { Loading, ErrorState } from "../components/States";
import { useCatalog, modelBySlug } from "../store/useCatalog";
import { useToast } from "../store/useToast";
import { api } from "../lib/api";
import { money, plusMoney, SPEC_LABELS } from "../lib/format";
import NotFound from "./NotFound";
import { cfgParam } from "./SavedBuild";

// The configuration lives in the URL (?trim=...&color=...), so the back
// button, refresh and copy-pasted links all keep the same car.
function useConfig(model) {
  const [params, setParams] = useSearchParams();
  const valid = (list, id) => (list.some((o) => o.id === id) ? id : list[0].id);
  const config = model && {
    trim: valid(model.trims, params.get("trim")),
    color: valid(model.colors, params.get("color")),
    wheels: valid(model.wheels, params.get("wheels")),
    packages: (params.get("options") || "").split(",").filter(Boolean),
  };
  const update = (patch) => {
    const next = { ...config, ...patch };
    setParams(
      { trim: next.trim, color: next.color, wheels: next.wheels, ...(next.packages.length ? { options: next.packages.join(",") } : {}) },
      { replace: true, preventScrollReset: true }
    );
  };
  return [config, update];
}

function useQuote(model, config) {
  const [quote, setQuote] = useState(null);
  const [pending, setPending] = useState(false);
  const key = model && JSON.stringify({ model: model.slug, ...config });
  const latest = useRef(key);

  useEffect(() => {
    if (!key) return;
    latest.current = key;
    setPending(true);
    const t = setTimeout(async () => {
      try {
        const q = await api("/quote", { method: "POST", body: JSON.parse(key) });
        if (latest.current === key) setQuote(q);
      } catch (err) {
        if (latest.current === key) useToast.getState().show(err.message, "error");
      } finally {
        if (latest.current === key) setPending(false);
      }
    }, 150);
    return () => clearTimeout(t);
  }, [key]);

  return [quote, pending];
}

function Section({ step, title, children, aside }) {
  return (
    <section className="border-t border-line py-8">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-semibold">
          <span className="mr-2 font-display text-muted">{step}</span>
          {title}
        </h2>
        {aside && <span className="text-sm text-muted">{aside}</span>}
      </div>
      {children}
    </section>
  );
}

function SpecStrip({ specs }) {
  return (
    <dl className="grid grid-cols-4 gap-2">
      {SPEC_LABELS.map(({ key, label, unit }) => (
        <div key={key} className="text-center">
          <dd className="display whitespace-nowrap text-[clamp(1.1rem,2.6vw,1.9rem)]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={specs[key]} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} className="inline-block">
                {specs[key]}
              </motion.span>
            </AnimatePresence>
            {unit && <span className="ml-1 text-xs font-semibold text-muted sm:text-sm">{unit}</span>}
          </dd>
          <dt className="text-xs text-muted sm:text-sm">{label}</dt>
        </div>
      ))}
    </dl>
  );
}

export default function Configurator() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { models, packages, status, error, load } = useCatalog();
  const model = modelBySlug(models, slug);
  const [config, update] = useConfig(model);
  const [quote, pending] = useQuote(model, config);
  const [saving, setSaving] = useState(false);
  const [spinKey, setSpinKey] = useState(0);

  const trim = model && model.trims.find((t) => t.id === config.trim);
  const color = model && model.colors.find((c) => c.id === config.color);
  const wheel = model && model.wheels.find((w) => w.id === config.wheels);
  const included = useMemo(() => new Set(trim?.includes || []), [trim]);
  const specs = model && { ...model.specs, ...(trim?.specs || {}) };

  if (status === "error") return <ErrorState message={error} onRetry={load} />;
  if (status !== "ready") return <Loading label="Loading the configurator" />;
  if (!model) return <NotFound />;

  const togglePackage = (id) => {
    if (included.has(id)) return;
    const has = config.packages.includes(id);
    update({ packages: has ? config.packages.filter((p) => p !== id) : [...config.packages, id] });
  };

  const save = async () => {
    setSaving(true);
    try {
      const { code, quote: q } = await api("/builds", { method: "POST", body: { model: model.slug, ...config } });
      navigate(`/b/${code}?cfg=${cfgParam(q)}`, { state: { justSaved: true } });
    } catch (err) {
      useToast.getState().show(err.message, "error");
      setSaving(false);
    }
  };

  const total = quote?.model === model.slug ? quote.total : null;

  return (
    <div className="pb-28 lg:pb-0">
      <div className="wrap grid gap-x-12 lg:grid-cols-[1.45fr_1fr]">
        {/* Stage */}
        <div className="pt-6 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:min-h-[34rem] lg:pb-6">
          <div className="studio flex h-full flex-col justify-between rounded-[2rem] p-5 sm:p-8">
            <div>
              <h1 className="display text-[clamp(2.4rem,6vw,4.4rem)]">
                {model.name} <span className="text-muted">{trim.name}</span>
              </h1>
              <p className="mt-2 text-muted">{model.tagline}</p>
            </div>
            <motion.div key={`${model.slug}-${spinKey}`} initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.9, ease: [0.2, 0.7, 0.3, 1] }} className="my-4">
              <CarArt body={model.body} paint={color.hex} wheel={wheel} spinning className="w-full" title={`${model.name} in ${color.name} with ${wheel.name} wheels`} />
            </motion.div>
            <SpecStrip specs={specs} />
          </div>
        </div>

        {/* Options */}
        <div className="pt-6">
        {/* Model switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6" role="tablist" aria-label="Choose a car">
          {models.map((m) => (
            <Link
              key={m.slug}
              to={`/build/${m.slug}`}
              role="tab"
              aria-selected={m.slug === model.slug}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${m.slug === model.slug ? "bg-ink text-paper" : "hover:bg-line"}`}
            >
              {m.name}
            </Link>
          ))}
        </div>
          <Section step="01" title="Trim">
            <div className="grid gap-3" role="radiogroup" aria-label="Trim">
              {model.trims.map((t) => (
                <button key={t.id} role="radio" aria-checked={t.id === config.trim} onClick={() => update({ trim: t.id })} className="choice p-4">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold">{t.name}</span>
                    <span className="text-sm text-muted">{t.price ? `+ ${money(t.price)}` : money(model.basePrice)}</span>
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    {[
                      `${t.specs?.rangeKm ?? model.specs.rangeKm} km range`,
                      `0–100 in ${t.specs?.zeroTo100 ?? model.specs.zeroTo100} s`,
                      ...(t.includes?.length ? [`includes ${t.includes.map((id) => packages.find((p) => p.id === id)?.name.toLowerCase()).join(" and ")}`] : []),
                    ].join(" · ")}
                  </span>
                </button>
              ))}
            </div>
          </Section>

          <Section step="02" title="Paint" aside={`${color.name} · ${plusMoney(color.price)}`}>
            <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Paint">
              {model.colors.map((c) => (
                <button
                  key={c.id}
                  role="radio"
                  aria-checked={c.id === config.color}
                  aria-label={`${c.name}, ${plusMoney(c.price)}`}
                  title={c.name}
                  onClick={() => update({ color: c.id })}
                  className={`h-14 w-14 rounded-full ring-offset-[3px] ring-offset-paper transition ${c.id === config.color ? "ring-2 ring-ink" : "ring-1 ring-black/15 hover:scale-105"}`}
                  style={{ background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,.45), transparent 45%), ${c.hex}` }}
                />
              ))}
            </div>
          </Section>

          <Section step="03" title="Wheels">
            <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Wheels">
              {model.wheels.map((w) => (
                <button
                  key={w.id}
                  role="radio"
                  aria-checked={w.id === config.wheels}
                  onClick={() => {
                    update({ wheels: w.id });
                    setSpinKey((k) => k + 1);
                  }}
                  className="choice flex flex-col items-center p-3 text-center"
                >
                  <WheelPreview style={w.style} finish={w.finish} size={64} />
                  <span className="mt-2 text-sm font-semibold leading-tight">{w.name}</span>
                  <span className="mt-0.5 text-xs text-muted">{plusMoney(w.price)}</span>
                </button>
              ))}
            </div>
          </Section>

          <Section step="04" title="Options">
            <div className="grid gap-3">
              {packages.map((p) => {
                const inc = included.has(p.id);
                const on = inc || config.packages.includes(p.id);
                return (
                  <button key={p.id} aria-pressed={on} onClick={() => togglePackage(p.id)} disabled={inc} className="choice flex items-center gap-4 p-3 disabled:!pointer-events-auto disabled:cursor-default">
                    <img src={p.media.poster || p.media.src} alt="" className="h-16 w-20 shrink-0 rounded-lg object-cover" loading="lazy" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="font-semibold">{p.name}</span>
                        <span className="shrink-0 text-sm text-muted">{inc ? `With ${trim.name}` : money(p.price)}</span>
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-sm text-muted">{p.description}</span>
                    </span>
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-[1.5px] ${on ? "border-ink bg-ink text-paper" : "border-line"}`} aria-hidden="true">
                      {on && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section step="05" title="Summary">
            {quote?.model === model.slug ? (
              <div className={`transition-opacity ${pending ? "opacity-60" : ""}`}>
                <ul className="divide-y divide-line text-[0.95rem]">
                  {quote.lines.map((l) => (
                    <li key={l.label} className="flex justify-between gap-4 py-2.5">
                      <span>
                        {l.label}
                        {l.note && <span className="ml-2 text-sm text-muted">{l.note}</span>}
                      </span>
                      <span className="shrink-0 tabular-nums">{l.amount ? money(l.amount) : "—"}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-baseline justify-between border-t-2 border-ink pt-4">
                  <span className="font-semibold">Total</span>
                  <span className="display text-[2rem] tabular-nums">{money(quote.total)}</span>
                </div>
                <p className="mt-2 text-xs text-muted">Prices are worked out by the server. Taxes and incentives not included.</p>
              </div>
            ) : (
              <p className="text-muted">Working out the price…</p>
            )}
            <div className="mt-6 hidden gap-3 lg:flex">
              <button onClick={save} disabled={saving || total == null} className="btn btn-dark flex-1">
                {saving ? "Saving…" : "Save and share"}
              </button>
              <Link to={`/test-drive?model=${model.slug}`} className="btn btn-ghost flex-1">
                Test drive
              </Link>
            </div>
          </Section>
        </div>
      </div>

      {/* Mobile price bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur lg:hidden">
        <div className="wrap flex items-center justify-between gap-4 py-3">
          <div>
            <p className="text-xs text-muted">{model.name} {trim.name}</p>
            <p className={`display text-[1.5rem] tabular-nums transition-opacity ${pending ? "opacity-60" : ""}`}>{total != null ? money(total) : "…"}</p>
          </div>
          <button onClick={save} disabled={saving || total == null} className="btn btn-dark">
            {saving ? "Saving…" : "Save and share"}
          </button>
        </div>
      </div>
    </div>
  );
}
