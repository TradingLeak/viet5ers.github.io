// Sinh dữ liệu OHLCV mô phỏng cho XAUUSD (minh hoạ), neo theo các mốc công bố:
// - Đóng cửa tuần 26/09/2026: 4.321 (tuần trước 4.416)
// - Đỉnh tháng 8: 4.755 (25/08/2026)
// - Đáy tháng 9: ~4.225-4.245
// - Fair value ~4.001, trigger flip 4.190
const fs = require('fs');
const path = require('path');

let seed = 20260927;
function rnd() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

// Đường giá đóng cửa theo ngày (thứ 2 -> thứ 6), dựng tay để bám sát các mốc công bố
const closePath = [
  4020, 4005, 3990, 3985, 3995,           // 22-26/06 (test fair value 3.979)
  3990, 4010, 4030, 4050, 4062,           // 29/06-03/07
  4080, 4105, 4130, 4145, 4152,           // 06-10/07
  4160, 4185, 4205, 4210, 4213,           // 13-17/07
  4200, 4190, 4195, 4185, 4180,           // 20-24/07 (hồi nhẹ)
  4200, 4230, 4260, 4280, 4292,           // 27-31/07
  4305, 4330, 4355, 4370, 4381,           // 03-07/08
  4395, 4420, 4445, 4460, 4472,           // 10-14/08
  4500, 4540, 4575, 4600, 4620,           // 17-21/08
  4655, 4720, 4680, 4640, 4620,           // 24-28/08 (đỉnh 4.755 ngày 25/08)
  4600, 4560, 4520, 4470, 4431,           // 31/08-04/09 (giảm ~2% cuối tuần)
  4425, 4400, 4370, 4340, 4310,           // 07-11/09
  4380, 4340, 4290, 4360, 4416,           // 14-18/09 (bật từ vùng 4.225-4.235)
  4390, 4355, 4331, 4290, 4321,           // 21-25/09 (biên độ tuần ~216 điểm)
];

const dates = [];
{
  const d = new Date('2026-06-22T00:00:00Z');
  while (dates.length < closePath.length) {
    const day = d.getUTCDay();
    if (day !== 0 && day !== 6) dates.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
}

// Bù nhiễu OHLC quanh đường giá đóng cửa; các ngày then chốt ghim high/low cố định
const fixedHigh = { '2026-08-25': 4755.0, '2026-08-26': 4718.0, '2026-09-21': 4461.0 };
const fixedLow = { '2026-08-25': 4690.5, '2026-09-24': 4245.3, '2026-06-26': 3964.1 };

const rows = [];
for (let i = 0; i < dates.length; i++) {
  const d = dates[i];
  const close = closePath[i];
  const prev = i === 0 ? close - 8 : closePath[i - 1];
  const gap = (rnd() * 2 - 1) * 9;
  const open = Math.round((prev + gap) * 10) / 10;
  const body = Math.abs(close - open);
  const wickUp = 4 + rnd() * 8 + body * 0.08;
  const wickDn = 4 + rnd() * 8 + body * 0.08;
  let high = Math.round((Math.max(open, close) + wickUp) * 10) / 10;
  let low = Math.round((Math.min(open, close) - wickDn) * 10) / 10;
  if (fixedHigh[d] !== undefined) high = fixedHigh[d];
  if (fixedLow[d] !== undefined) low = fixedLow[d];
  const vol = Math.round(90000 + rnd() * 110000 + body * 6500);
  rows.push({ d, o: open, h: high, l: low, c: close, v: vol });
}

// Chỉ báo: SMA20, SMA50, RSI14
const closes = rows.map((r) => r.c);
function sma(n, i) {
  if (i < n - 1) return null;
  let s = 0;
  for (let k = i - n + 1; k <= i; k++) s += closes[k];
  return Math.round((s / n) * 100) / 100;
}
function rsi(n, i) {
  if (i < n) return null;
  let g = 0, l = 0;
  for (let k = i - n + 1; k <= i; k++) {
    const diff = closes[k] - closes[k - 1];
    if (diff >= 0) g += diff; else l -= diff;
  }
  if (l === 0) return 100;
  return Math.round((100 - 100 / (1 + g / l)) * 100) / 100;
}
rows.forEach((r, i) => {
  r.sma20 = sma(20, i);
  r.sma50 = sma(50, i);
  r.rsi = rsi(14, i);
});

// MACD (12,26,9) trên chuỗi đóng cửa
function ema(arr, n) {
  const k = 2 / (n + 1);
  const out = [];
  let prev = arr[0];
  arr.forEach((v, i) => {
    prev = i === 0 ? v : v * k + prev * (1 - k);
    out.push(prev);
  });
  return out;
}
const ema12 = ema(closes, 12), ema26 = ema(closes, 26);
const macdLine = closes.map((_, i) => ema12[i] - ema26[i]);
const signalLine = ema(macdLine, 9);
const hist = macdLine.map((v, i) => v - signalLine[i]);
rows.forEach((r, i) => {
  r.macd = Math.round(macdLine[i] * 100) / 100;
  r.macdSignal = Math.round(signalLine[i] * 100) / 100;
  r.macdHist = Math.round(hist[i] * 100) / 100;
});

// ATR14
rows.forEach((r, i) => {
  if (i < 14) { r.atr = null; return; }
  let s = 0;
  for (let k = i - 13; k <= i; k++) {
    const a = rows[k], pc = rows[k - 1].c;
    s += Math.max(a.h - a.l, Math.abs(a.h - pc), Math.abs(a.l - pc));
  }
  r.atr = Math.round((s / 14) * 100) / 100;
});

const out = {
  meta: {
    symbol: 'XAUUSD',
    generated: '2026-09-27',
    note: 'Dữ liệu OHLCV mang tính minh hoạ, được dựng lại từ các mốc giá công bố trong tuần 21-26/09/2026.',
  },
  candles: rows,
};

const dest = path.join(__dirname, '..', 'assets', 'js', 'data.js');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(
  dest,
  '// Dữ liệu giá mô phỏng (xem meta.note). Sinh bởi tools/gen-data.js\n' +
    'window.XAU_DATA = ' + JSON.stringify(out) + ';\n'
);

// Kiểm tra các mốc
const last = rows[rows.length - 1];
const wk = rows.slice(-5);
console.log('candles:', rows.length, '| last close:', last.c, '| SMA20:', last.sma20, '| SMA50:', last.sma50, '| RSI:', last.rsi, '| MACD hist:', last.macdHist, '| ATR:', last.atr);
console.log('week 21-25 high:', Math.max(...wk.map((x) => x.h)), 'low:', Math.min(...wk.map((x) => x.l)));
console.log('3M high:', Math.max(...rows.map((x) => x.h)), '3M low:', Math.min(...rows.map((x) => x.l)));
