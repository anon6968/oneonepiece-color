// localStorage can throw (private mode, disabled storage) — never let a
// preference read/write take the reader down.

export function loadPref(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function savePref(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export interface Progress {
  n: number;
  page: number;
  ts: number;
}

export function progressKey(slug: string) {
  return `cm_progress_${slug}`;
}

export function loadProgress(slug: string): Progress | null {
  const raw = loadPref(progressKey(slug));
  if (!raw) return null;
  try {
    const p = JSON.parse(raw) as Progress;
    return Number.isInteger(p.n) && Number.isInteger(p.page) ? p : null;
  } catch {
    return null;
  }
}

export function saveProgress(slug: string, p: Progress) {
  savePref(progressKey(slug), JSON.stringify(p));
}
