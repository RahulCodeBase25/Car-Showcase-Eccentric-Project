import { useToast } from "../store/useToast";

// All API calls go to /api: the Vite dev server proxies it locally, and
// Vercel rewrites it to the hosted API in production.
const SLOW_MS = 3500;

export async function api(path, { method = "GET", body } = {}) {
  // The free API host sleeps when idle; tell people why the first load is slow
  const slow = setTimeout(() => useToast.getState().show("Waking up the server. The first load can take up to a minute…", "info", 0), SLOW_MS);
  try {
    const res = await fetch(`/api${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.message || `Request failed (${res.status})`);
      err.status = res.status;
      throw err;
    }
    return data;
  } catch (err) {
    if (err instanceof TypeError) throw new Error("Can't reach the server. Check your connection and try again.");
    throw err;
  } finally {
    clearTimeout(slow);
    useToast.getState().hide("info");
  }
}
