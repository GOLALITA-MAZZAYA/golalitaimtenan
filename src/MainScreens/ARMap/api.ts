// src/components/AR/api.ts
import type { Merchant } from "./types";

const BASE = "https://www.golalita.com/go/api";
const URL = `${BASE}/user/category/merchant/list/nearby`;

/** ================= Helpers: coercion & guards ================= */
function toNumberOrNull(v: any): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function toBoolean(v: any): boolean | undefined {
  if (v === true || v === false) return v;
  if (v === 1 || v === "1" || v === "true") return true;
  if (v === 0 || v === "0" || v === "false") return false;
  return undefined;
}
function isMerchantLike(x: any): boolean {
  return (
    x &&
    typeof x === "object" &&
    typeof x.merchant_id === "number" &&
    typeof x.merchant_name === "string" &&
    (typeof x.category_id === "number" || x.category_id == null) &&
    (typeof x.category_name === "string" || x.category_name == null) &&
    (typeof x.latitude === "number" || typeof x.latitude === "string") &&
    (typeof x.longitude === "number" || typeof x.longitude === "string")
  );
}
function normalizeMerchant(x: any): Merchant | null {
  if (!isMerchantLike(x)) return null;
  const latitude = toNumberOrNull(x.latitude);
  const longitude = toNumberOrNull(x.longitude);
  if (latitude == null || longitude == null) return null;
  return {
    merchant_id: x.merchant_id,
    merchant_name: x.merchant_name,
    category_id: x.category_id ?? null,
    category_name: x.category_name ?? null,
    latitude,
    longitude,
    have_offers: toBoolean(x.have_offers),
    local: toBoolean(x.local),
    global: toBoolean(x.global),
  } as Merchant;
}

/** ================= Robust parse & error extraction ================= */
function tryJson(text: string): any | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** парсим «псевдо-JSON» от Odoo, например: ("jsonrpc":"2.0","error":{...}) */
function parseJsonish(text: string): any | null {
  // quick fix: заменить круглые скобки на фигурные в начале/конце, убрать \n
  let s = text.trim().replace(/\r?\n/g, " ");
  // иногда приходит без внешних {} — пробуем подсказать
  if (s.startsWith("(") && s.endsWith(")")) {
    s = `{${s.slice(1, -1)}}`;
  }
  // иногда без запятых после кавычек — не лечим агрессивно, только очевидное
  try {
    return JSON.parse(s);
  } catch {
    /* fall through */
  }

  // последняя попытка: вытащить блок error {...} через RegExp
  const m = s.match(/"error"\s*:\s*\{[\s\S]*?\}/);
  if (m) {
    const candidate = `{${m[0]}}`; // {"error":{...}}
    const j = tryJson(candidate);
    if (j) return j;
  }
  return null;
}

function extractOdooError(payload: any, text: string): string | null {
  // Вариант 1: классический JSON-RPC: { jsonrpc, id, error: { code, message, data: { debug } } }
  const err = payload?.error;
  if (err && typeof err === "object") {
    const msg = [err.message, err.data?.name, err.data?.message]
      .filter(Boolean)
      .join(" · ");
    const debug =
      typeof err.data?.debug === "string"
        ? err.data.debug.split("\n").slice(0, 3).join(" ")
        : "";
    return (msg || "Odoo Server Error") + (debug ? ` — ${debug}` : "");
  }
  // Вариант 2: сырая строка, достанем message через RegExp
  const m = /"message"\s*:\s*"([^"]+)"/.exec(text);
  if (m) return m[1];
  // fallback: урежем текст
  return null;
}

/** ================= Fetch utils ================= */
async function fetchWithTimeout(
  input: RequestInfo,
  init: RequestInit,
  timeoutMs = 8000
): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

async function postJson(
  url: string,
  body: unknown,
  timeoutMs = 8000,
  retries = 1
): Promise<any> {
  let lastErr: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(body ?? {}),
        },
        timeoutMs
      );

      const text = await res.text();

      // сначала нормальный JSON
      let json: any = tryJson(text);

      // если не получилось — пробуем «jsonish» от Odoo
      if (!json) {
        const j2 = parseJsonish(text);
        if (j2) json = j2;
      }

      // если статус не ок — попробуем вытащить человекочитаемую ошибку
      if (!res.ok) {
        const human = json ? extractOdooError(json, text) : null;
        throw new Error(human || res.statusText || `HTTP ${res.status}`);
      }

      // даже при 200 Odoo может вернуть JSON-RPC ошибку
      if (json && typeof json === "object" && json.error) {
        const human = extractOdooError(json, text) || "Odoo Server Error";
        throw new Error(human);
      }

      // если ничего нормально не распарсили, но статус ок — отдаём сырой текст
      return json ?? text;
    } catch (e) {
      lastErr = e;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
        continue;
      }
      throw lastErr;
    }
  }
  throw lastErr;
}

/** ================= Optional filters ================= */
export type MerchantsQuery = {
  onlyWithOffers?: boolean;
  locality?: "local" | "global" | "all";
  categoryIds?: number[];
  limit?: number;
  coords: number[];
};

function applyFilters(list: Merchant[], q?: MerchantsQuery): Merchant[] {
  if (!q) return list;
  let out = list;

  if (q.onlyWithOffers) out = out.filter((m) => m.have_offers === true);

  if (q.locality && q.locality !== "all") {
    if (q.locality === "local") out = out.filter((m) => m.local === true);
    if (q.locality === "global") out = out.filter((m) => m.local !== true); // всё, что не local=true, считаем «global»
  }

  if (q.categoryIds?.length) {
    const set = new Set(q.categoryIds);
    out = out.filter((m) =>
      m.category_id != null ? set.has(m.category_id) : false
    );
  }

  if (q.limit && q.limit > 0) out = out.slice(0, q.limit);
  return out;
}

/** ================= Debug point (твоя тестовая точка) ================= */
const ADD_DEBUG_POINT = true;
const DEBUG_LAT = 51.499815376389996;
const DEBUG_LNG = 31.289470513430917;

function appendDebugPoint(list: Merchant[]): Merchant[] {
  if (!ADD_DEBUG_POINT) return list;
  const exists = list.some(
    (m) =>
      typeof m.latitude === "number" &&
      typeof m.longitude === "number" &&
      Math.abs(m.latitude - DEBUG_LAT) < 1e-5 &&
      Math.abs(m.longitude - DEBUG_LNG) < 1e-5
  );

  return list;
}

/** ================= Public API ================= */
export async function fetchMerchants(
  query?: MerchantsQuery
): Promise<Merchant[]> {
  const raw = await postJson(URL, {}, 8000, 1);

  // Нормальные случаи:
  // 1) массив
  // 2) { result: [...] }
  let arr: any[] | null = null;

  if (Array.isArray(raw)) {
    arr = raw;
  } else if (
    raw &&
    typeof raw === "object" &&
    Array.isArray((raw as any).result)
  ) {
    arr = (raw as any).result;
  }

  if (!arr) {
    // сюда попадём, например, когда пришла строка/неожиданный объект без result
    const sample =
      typeof raw === "string"
        ? raw.slice(0, 280)
        : JSON.stringify(raw).slice(0, 280);
    throw new Error(`API shape mismatch (expected array). Sample: ${sample}`);
  }

  const normalized: Merchant[] = [];
  for (const row of arr) {
    const m = normalizeMerchant(row);
    if (m) normalized.push(m);
  }

  normalized.sort((a, b) =>
    (a.merchant_name || "").localeCompare(b.merchant_name || "", "en")
  );

  const filtered = applyFilters(normalized, query);
  return appendDebugPoint(filtered);
}

export type LocalityGroups = {
  local: Merchant[];
  international: Merchant[];
  unknown: Merchant[];
};

export function groupByLocality(merchants: Merchant[]): LocalityGroups {
  const local: Merchant[] = [];
  const international: Merchant[] = [];
  const unknown: Merchant[] = [];

  for (const m of merchants) {
    if (m.local === true) local.push(m);
    else if (m.global === true) international.push(m);
    else unknown.push(m);
  }
  return { local, international, unknown };
}
