import fs from 'fs';
import path from 'path';

const tickers = [
  'BZ=F',
  'GC=F',
  'INR=X',
  '^NSEI',
  '^NSEBANK',
  '^CNXREALTY',
  '^GSPC',
  '^TNX',
  'ONGC.NS',
  'INDIGO.NS',
  'ASIANPAINT.NS',
  'HDFCBANK.NS',
  'RELIANCE.NS',
  'TCS.NS'
];

const startDate = new Date('2023-01-02');
const tradingDays = [];
let cur = new Date(startDate);

while (tradingDays.length < 260) {
  const day = cur.getDay();
  if (day !== 0 && day !== 6) {
    tradingDays.push(cur.toISOString().split('T')[0]);
  }
  cur.setDate(cur.getDate() + 1);
}

// Known trigger dates for commodity shock (Brent crude spikes)
const oilSpikeDays = new Set([35, 75, 120, 165, 210, 245]);
// Rate hike decisions
const rateHikeDays = new Set([40, 85, 140, 195, 230]);

const initialPrices = {
  'BZ=F': 82.5,
  'GC=F': 1920.0,
  'INR=X': 82.2,
  '^NSEI': 18100.0,
  '^NSEBANK': 42800.0,
  '^CNXREALTY': 425.0,
  '^GSPC': 3900.0,
  '^TNX': 3.65,
  'ONGC.NS': 148.0,
  'INDIGO.NS': 2050.0,
  'ASIANPAINT.NS': 3120.0,
  'HDFCBANK.NS': 1610.0,
  'RELIANCE.NS': 2480.0,
  'TCS.NS': 3240.0
};

function pseudoRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const cache = {};

tickers.forEach((ticker, tIdx) => {
  let price = initialPrices[ticker] || 100;
  const prices = [price];
  const returns = [0];
  const dates = [tradingDays[0]];

  for (let i = 1; i < tradingDays.length; i++) {
    const seed = tIdx * 1000 + i;
    const noise = (pseudoRandom(seed) - 0.5) * 0.02;
    let dailyReturn = noise;

    if (oilSpikeDays.has(i)) {
      if (ticker === 'BZ=F') dailyReturn = 0.052 + pseudoRandom(seed) * 0.02; // +5.2% to +7.2% oil shock (> 2 sigma)
      else if (ticker === 'ONGC.NS') dailyReturn = 0.038 + pseudoRandom(seed) * 0.015; // +3.8%
      else if (ticker === 'INDIGO.NS') dailyReturn = -0.042 - pseudoRandom(seed) * 0.015; // -4.2%
      else if (ticker === 'ASIANPAINT.NS') dailyReturn = -0.035 - pseudoRandom(seed) * 0.012; // -3.5%
      else if (ticker === 'INR=X') dailyReturn = 0.007 + pseudoRandom(seed) * 0.004; // Rupee weakens
      else if (ticker === '^NSEI') dailyReturn = -0.018 - pseudoRandom(seed) * 0.008; // -1.8%
      else if (ticker === 'GC=F') dailyReturn = 0.016 + pseudoRandom(seed) * 0.008; // Safe haven
    }

    if (rateHikeDays.has(i)) {
      if (ticker === '^TNX') dailyReturn = 0.045 + pseudoRandom(seed) * 0.02;
      else if (ticker === '^NSEBANK') dailyReturn = -0.025 - pseudoRandom(seed) * 0.01;
      else if (ticker === '^CNXREALTY') dailyReturn = -0.032 - pseudoRandom(seed) * 0.01;
      else if (ticker === 'INR=X') dailyReturn = -0.005 - pseudoRandom(seed) * 0.003;
      else if (ticker === 'TCS.NS') dailyReturn = 0.012 + pseudoRandom(seed) * 0.008;
    }

    price = Math.max(0.01, price * (1 + dailyReturn));
    prices.push(parseFloat(price.toFixed(2)));
    returns.push(parseFloat(dailyReturn.toFixed(4)));
    dates.push(tradingDays[i]);
  }

  cache[ticker] = { dates, prices, returns };
});

const outDir = path.join(process.cwd(), 'src', 'data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const outPath = path.join(outDir, 'market_cache.json');
fs.writeFileSync(outPath, JSON.stringify(cache, null, 2));
console.log(`Generated market cache for ${tickers.length} tickers at ${outPath}`);
