import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import CarArt from "../components/CarArt";
import { Loading } from "../components/States";
import { useCatalog, modelBySlug } from "../store/useCatalog";
import { useToast } from "../store/useToast";
import { api } from "../lib/api";
import { money, SPEC_LABELS } from "../lib/format";

// Share links also carry the configuration (?cfg=model~trim~colour~wheels~options).
// If the demo database has been reset, the page can still rebuild the car.
export const cfgParam = (b) => [b.model, b.trim, b.color, b.wheels, (b.packages || []).join(",")].join("~");
const parseCfg = (cfg) => {
  const [model, trim, color, wheels, options = ""] = (cfg || "").split("~");
  return model && trim && color && wheels ? { model, trim, color, wheels, packages: options.split(",").filter(Boolean) } : null;
};

export function FindBuild({ className = "" }) {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  return (
    <form
      className={`flex gap-2 ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        if (code.trim()) navigate(`/b/${code.trim().toUpperCase()}`);
      }}
    >
      <label className="sr-only" htmlFor="find-code">Build code</label>
      <input id="find-code" className="field max-w-[12rem] uppercase tracking-[0.2em]" placeholder="Build code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} />
      <button className="btn btn-dark">Open</button>
    </form>
  );
}

export default function SavedBuild() {
  const { code } = useParams();
  const { state } = useLocation();
  const [params] = useSearchParams();
  const cfg = params.get("cfg");
  const { models, status } = useCatalog();
  const [build, setBuild] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let live = true;
    setBuild(null);
    setError(null);
    api(`/builds/${encodeURIComponent(code)}`)
      .then((b) => live && setBuild(b))
      .catch(async (err) => {
        const fallback = err.status === 404 && parseCfg(cfg);
        if (!fallback) return live && setError(err);
        try {
          const quote = await api("/quote", { method: "POST", body: fallback });
          if (live) setBuild({ ...fallback, code: code.toUpperCase(), quote, createdAt: new Date().toISOString(), restored: true });
        } catch {
          if (live) setError(err);
        }
      });
    return () => {
      live = false;
    };
  }, [code, cfg]);

  if (error) {
    return (
      <div className="wrap flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="eyebrow">Build {code}</p>
        <h1 className="display mt-3 text-[clamp(2rem,6vw,3.4rem)]">{error.status === 404 ? "No build with that code." : "Couldn't load this build."}</h1>
        <p className="mt-4 max-w-md text-muted">{error.status === 404 ? "Check the code, or start a new build." : error.message}</p>
        <FindBuild className="mt-8" />
        <Link to="/build/aero" className="mt-4 underline underline-offset-4">
          Start a new build
        </Link>
      </div>
    );
  }
  if (!build || status !== "ready") return <Loading label="Loading your build" />;

  const model = modelBySlug(models, build.model);
  const q = build.quote;
  const trimName = model?.trims.find((t) => t.id === build.trim)?.name || build.trim;
  const color = model?.colors.find((c) => c.id === build.color);
  const wheel = model?.wheels.find((w) => w.id === build.wheels);
  const link = `${window.location.origin}/b/${build.code}?cfg=${cfgParam(build)}`;
  const editUrl = `/build/${build.model}?trim=${build.trim}&color=${build.color}&wheels=${build.wheels}${build.packages.length ? `&options=${build.packages.join(",")}` : ""}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      useToast.getState().show("Link copied");
    } catch {
      useToast.getState().show(`Copy this link: ${link}`, "info", 8000);
    }
  };

  return (
    <div className="wrap pt-8">
      {build.restored && (
        <p className="mb-6 rounded-2xl border border-line bg-card px-5 py-3 text-sm text-muted">
          This demo's database resets now and then, so this build was rebuilt from its link and priced again today.
        </p>
      )}
      {state?.justSaved && (
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-2xl bg-ink px-5 py-3 text-sm text-paper">
          Saved. Anyone with this link can see your build.
        </motion.p>
      )}
      <div className="grid gap-10 lg:grid-cols-[1.45fr_1fr]">
        <div className="studio rounded-[2rem] p-5 sm:p-8">
          <p className="eyebrow">Build {build.code}</p>
          <h1 className="display mt-3 text-[clamp(2.2rem,6vw,4rem)]">
            {model?.name} <span className="text-muted">{trimName}</span>
          </h1>
          {model && color && wheel && (
            <motion.div initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.9, ease: [0.2, 0.7, 0.3, 1] }}>
              <CarArt body={model.body} paint={color.hex} wheel={wheel} spinning className="my-4 w-full" title={`${model.name} in ${color.name}`} />
            </motion.div>
          )}
          <dl className="grid grid-cols-4 gap-2">
            {SPEC_LABELS.map(({ key, label, unit }) => (
              <div key={key} className="text-center">
                <dd className="display whitespace-nowrap text-[clamp(1.1rem,2.6vw,1.8rem)]">
                  {q.specs[key]}
                  {unit && <span className="ml-1 text-xs font-semibold text-muted sm:text-sm">{unit}</span>}
                </dd>
                <dt className="text-xs text-muted sm:text-sm">{label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <ul className="divide-y divide-line text-[0.95rem]">
            {q.lines.map((l) => (
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
            <span className="display text-[2rem] tabular-nums">{money(q.total)}</span>
          </div>
          <p className="mt-2 text-xs text-muted">
            Price as quoted on {new Date(build.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. Taxes and incentives not included.
          </p>

          <div className="mt-8 grid gap-3">
            <button onClick={copy} className="btn btn-dark">
              Copy link to this build
            </button>
            <Link to={`/test-drive?model=${build.model}&build=${build.code}`} className="btn btn-accent">
              Book a test drive
            </Link>
            <Link to={editUrl} className="btn btn-ghost">
              Change this build
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
