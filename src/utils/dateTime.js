// ── Helpers ────────────────────────────────────────────────────────
export const pad = (n) => String(n).padStart(2, "0");

// Formato interno — exigido pelo JavaScript para new Date() funcionar corretamente
const fmt = (d) => d.toISOString().split("T")[0]; // YYYY-MM-DD (interno)

// Formato brasileiro — usado como chave de storage e exibição
export const fmtBR = (d) =>
  `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`; // DD-MM-YYYY

// Converte DD-MM-YYYY → Date (para as funções que precisam do objeto Date)
export function parseDate(dateStrBR) {
  const [dd, mm, yyyy] = dateStrBR.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd, 12, 0, 0);
}

export const today = () => fmtBR(new Date());

// ── Easter calculation (Meeus/Jones/Butcher) ───────────────────────
function easterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

// ── Brazuca public holidays ──────────────────────────────────────
const FIXED = new Set([
  "01-01", // Confraternização Universal
  "04-21", // Tiradentes
  "05-01", // Dia do Trabalho
  "09-07", // Independência
  "10-12", // N.S. Aparecida
  "11-02", // Finados
  "11-15", // Proclamação da República
  "11-20", // Consciência Negra
  "12-25", // Natal
]);

const easterCache = {};

function getEasterHolidays(year) {
  if (easterCache[year]) return easterCache[year];
  const easter = easterDate(year);
  const offset = (d, n) => {
    const t = new Date(d);
    t.setDate(t.getDate() + n);
    return fmtBR(t);
  };
  easterCache[year] = new Set([
    offset(easter, -48), // Carnaval (segunda)
    offset(easter, -47), // Carnaval (terça)
    offset(easter, -2), // Sexta-feira Santa
    offset(easter, 0), // Páscoa
    offset(easter, 60), // Corpus Christi
  ]);
  return easterCache[year];
}

export function isHoliday(dateStrBR) {
  const d = parseDate(dateStrBR);
  const mmdd = pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  return FIXED.has(mmdd) || getEasterHolidays(d.getFullYear()).has(dateStrBR);
}

export function isWeekend(dateStrBR) {
  return (
    parseDate(dateStrBR).getDay() === 0 || parseDate(dateStrBR).getDay() === 6
  );
}

export function isWorkDay(dateStrBR) {
  return !isWeekend(dateStrBR) && !isHoliday(dateStrBR);
}

// ── Get all work days in a given month ────────────────────────────
export function getWorkDays(year, month) {
  const days = [];
  const lastDay = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= lastDay; i++) {
    const ds = `${pad(i)}-${pad(month + 1)}-${year}`;
    if (isWorkDay(ds)) days.push(ds);
  }
  return days;
}

// ── Time arithmetic ───────────────────────────────────────────────
export function parseTime(t) {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function calcWorkedMinutes(entry, lunchOut, lunchIn, exit) {
  const e = parseTime(entry);
  const s = parseTime(exit);
  if (e === null || s === null || s <= e) return null;
  let total = s - e;
  const lo = parseTime(lunchOut);
  const li = parseTime(lunchIn);
  if (lo !== null && li !== null && li > lo) total -= li - lo;
  return total;
}

export function minToStr(min, showSign = false) {
  if (min === null || min === undefined) return "—";
  const neg = min < 0;
  const abs = Math.abs(min);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const sign = showSign ? (neg ? "−" : "+") : neg ? "−" : "";
  return `${sign}${h}h ${pad(m)}m`;
}

// ── Date labels ───────────────────────────────────────────────────
export const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function dateLabel(dateStrBR) {
  const d = parseDate(dateStrBR);
  return `${WEEK_DAYS[d.getDay()]} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
}
