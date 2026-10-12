export interface Country {
  id: string;
  name: string;
  flag: string;
  lat: number;
  lon: number;
  code: string;
  hub: string;
}

export interface ChainNode {
  label: string;
  direction?: 'up' | 'down' | 'neutral';
}

export interface CountryEventData {
  countryName: string;
  eventTitle: string;
  chainGraph: ChainNode[];
  bulletPoints: string[];
  sources: string[];
  confidence: 'High' | 'Medium' | 'Empirical';
  confidenceScore: number;
  affectedSectors: string[];
  keyTickers: { ticker: string; change: string; positive: boolean }[];
  quantMetric: string;
  summary: string;
}

export interface ScenarioConnection {
  from: string;
  to: string;
  type?: 'energy' | 'supply_chain' | 'capital_flow';
  intensity?: number;
}

export interface DemoScenario {
  id: string;
  label: string;
  subtitle: string;
  defaultCountryId: string;
  connections: ScenarioConnection[];
  countryData: Record<string, CountryEventData>;
}

export const COUNTRIES: Country[] = [
  { id: 'india', name: 'India', flag: '🇮🇳', lat: 20.5937, lon: 78.9629, code: 'IND', hub: 'Mumbai / NSE' },
  { id: 'usa', name: 'United States', flag: '🇺🇸', lat: 37.0902, lon: -95.7129, code: 'USA', hub: 'New York / NYSE' },
  { id: 'saudi_arabia', name: 'Saudi Arabia', flag: '🇸🇦', lat: 23.8859, lon: 45.0792, code: 'SAU', hub: 'Riyadh / Tadawul' },
  { id: 'germany', name: 'Germany', flag: '🇩🇪', lat: 51.1657, lon: 10.4515, code: 'DEU', hub: 'Frankfurt / DAX' },
  { id: 'china', name: 'China', flag: '🇨🇳', lat: 35.8617, lon: 104.1954, code: 'CHN', hub: 'Shanghai / SSE' },
  { id: 'japan', name: 'Japan', flag: '🇯🇵', lat: 36.2048, lon: 138.2529, code: 'JPN', hub: 'Tokyo / TSE' },
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', lat: 55.3781, lon: -3.4360, code: 'GBR', hub: 'London / LSE' },
  { id: 'singapore', name: 'Singapore', flag: '🇸🇬', lat: 1.3521, lon: 103.8198, code: 'SGP', hub: 'Singapore / SGX' },
  { id: 'uae', name: 'United Arab Emirates', flag: '🇦🇪', lat: 23.4241, lon: 53.8478, code: 'ARE', hub: 'Dubai / DFM' },
  { id: 'brazil', name: 'Brazil', flag: '🇧🇷', lat: -14.2350, lon: -51.9253, code: 'BRA', hub: 'São Paulo / B3' },
  { id: 'australia', name: 'Australia', flag: '🇦🇺', lat: -25.2744, lon: 133.7751, code: 'AUS', hub: 'Sydney / ASX' },
  { id: 'france', name: 'France', flag: '🇫🇷', lat: 46.2276, lon: 2.2137, code: 'FRA', hub: 'Paris / Euronext' },
];

export const DEMO_SCENARIOS: Record<string, DemoScenario> = {
  oil_shock: {
    id: 'oil_shock',
    label: 'Oil Shock',
    subtitle: 'Crude supply disruption elevates transport feedstocks and tests fiscal balance',
    defaultCountryId: 'india',
    connections: [
      { from: 'saudi_arabia', to: 'india', type: 'energy', intensity: 1.0 },
      { from: 'saudi_arabia', to: 'germany', type: 'energy', intensity: 0.9 },
      { from: 'saudi_arabia', to: 'usa', type: 'energy', intensity: 0.8 },
      { from: 'saudi_arabia', to: 'japan', type: 'energy', intensity: 0.85 },
      { from: 'usa', to: 'germany', type: 'energy', intensity: 0.7 },
      { from: 'usa', to: 'uk', type: 'energy', intensity: 0.75 },
      { from: 'india', to: 'singapore', type: 'energy', intensity: 0.65 },
      { from: 'uae', to: 'india', type: 'energy', intensity: 0.9 },
    ],
    countryData: {
      india: {
        countryName: 'India',
        eventTitle: 'Crude Oil Impact',
        chainGraph: [
          { label: 'Oil Prices', direction: 'up' },
          { label: 'Fuel Costs', direction: 'up' },
          { label: 'Airline Stocks', direction: 'down' },
        ],
        bulletPoints: [
          'Rising crude prices squeeze airline profits',
          'Inflation risk increases.',
        ],
        sources: ['Bloomberg', 'Reuters'],
        confidence: 'High',
        confidenceScore: 96,
        affectedSectors: ['Civil Aviation', 'Paints & Polymers', 'Oil Marketing (OMCs)', 'Logistics'],
        keyTickers: [
          { ticker: 'INDIGO', change: '-4.8%', positive: false },
          { ticker: 'SPICEJET', change: '-6.2%', positive: false },
          { ticker: 'ONGC', change: '+5.4%', positive: true },
          { ticker: 'ASIANPAINT', change: '-3.7%', positive: false },
        ],
        quantMetric: 'CAR (5d): -4.2% | Corr: +0.84 | p < 0.01',
        summary: 'India imports over 85% of its crude oil requirements. A sustained $10/bbl price spike widens current account deficit by $15B and inflates aviation turbine fuel costs directly.',
      },
      usa: {
        countryName: 'United States',
        eventTitle: 'Refinery Spreads & Strategic Reserves',
        chainGraph: [
          { label: 'WTI Crude', direction: 'up' },
          { label: 'Refinery Margins', direction: 'up' },
          { label: 'Airline & Freight Equities', direction: 'down' },
        ],
        bulletPoints: [
          'Upstream drillers generate windfall free cash flow',
          'Consumer discretionary and transportation face margin compression.',
        ],
        sources: ['Bloomberg', 'Wall Street Journal'],
        confidence: 'High',
        confidenceScore: 94,
        affectedSectors: ['Energy Exploration', 'Airlines', 'Freight & Trucking'],
        keyTickers: [
          { ticker: 'XOM', change: '+4.5%', positive: true },
          { ticker: 'CVX', change: '+3.9%', positive: true },
          { ticker: 'DAL', change: '-5.1%', positive: false },
          { ticker: 'FDX', change: '-3.4%', positive: false },
        ],
        quantMetric: 'CAR (5d): -3.8% (Airlines) | Corr: +0.79 | p < 0.01',
        summary: 'US upstream producers benefit from high crude realizations, while downstream logistics and airlines absorb elevated fuel surcharges.',
      },
      saudi_arabia: {
        countryName: 'Saudi Arabia',
        eventTitle: 'OPEC+ Quota Realizations & Fiscal Windfall',
        chainGraph: [
          { label: 'Export Crude Realizations', direction: 'up' },
          { label: 'Fiscal Revenue', direction: 'up' },
          { label: 'Sovereign Wealth Deployment', direction: 'up' },
        ],
        bulletPoints: [
          'Aramco operating margins expand above 55%',
          'Sovereign wealth fund increases strategic global asset allocations.',
        ],
        sources: ['Reuters', 'Financial Times'],
        confidence: 'High',
        confidenceScore: 98,
        affectedSectors: ['State Energy', 'Petrochemicals', 'Sovereign Capital'],
        keyTickers: [
          { ticker: 'ARAMCO', change: '+4.1%', positive: true },
          { ticker: 'SABIC', change: '+2.3%', positive: true },
        ],
        quantMetric: 'CAR (5d): +6.2% | Corr: +0.92 | p < 0.001',
        summary: 'Crude benchmark surges immediately strengthen foreign reserves and state budget surpluses across the Gulf.',
      },
      germany: {
        countryName: 'Germany',
        eventTitle: 'Industrial Energy Cost & Factory Margin Squeeze',
        chainGraph: [
          { label: 'Brent Energy Spike', direction: 'up' },
          { label: 'Factory Power Bills', direction: 'up' },
          { label: 'Chemical Margins', direction: 'down' },
        ],
        bulletPoints: [
          'Heavy industrial feedstock costs increase by 14%',
          'Euro currency encounters pressure against USD on trade deficit.',
        ],
        sources: ['Financial Times', 'Reuters'],
        confidence: 'High',
        confidenceScore: 95,
        affectedSectors: ['Basic Materials', 'Automotive OEM', 'Commercial Aviation'],
        keyTickers: [
          { ticker: 'BASF', change: '-4.6%', positive: false },
          { ticker: 'LHA', change: '-5.3%', positive: false },
          { ticker: 'BAYER', change: '-3.1%', positive: false },
        ],
        quantMetric: 'CAR (5d): -4.9% | Corr: +0.81 | p < 0.01',
        summary: 'German manufacturing clusters in chemical and auto assembly absorb energy cost increases that compress operating margins.',
      },
      japan: {
        countryName: 'Japan',
        eventTitle: 'Import Energy Bill & Terms of Trade Deterioration',
        chainGraph: [
          { label: 'Import Costs', direction: 'up' },
          { label: 'Trade Balance', direction: 'down' },
          { label: 'Utility Surcharges', direction: 'up' },
        ],
        bulletPoints: [
          'Over 90% of petroleum consumption sourced overseas',
          'Aviation and electricity utilities file emergency fuel pass-throughs.',
        ],
        sources: ['Nikkei Asia', 'Bloomberg'],
        confidence: 'High',
        confidenceScore: 93,
        affectedSectors: ['Power Utilities', 'Civil Aviation', 'General Trading'],
        keyTickers: [
          { ticker: 'INPEX', change: '+4.8%', positive: true },
          { ticker: 'ANA', change: '-4.2%', positive: false },
          { ticker: 'TEPCO', change: '-2.9%', positive: false },
        ],
        quantMetric: 'CAR (5d): -3.4% | Corr: +0.76 | p < 0.05',
        summary: 'Resource-dependent Japanese corporations face direct import price transmission that strains corporate margins.',
      },
      uk: {
        countryName: 'United Kingdom',
        eventTitle: 'Retail Energy Inflation & Discretionary Spending Squeeze',
        chainGraph: [
          { label: 'Brent Benchmark', direction: 'up' },
          { label: 'Distribution Freight', direction: 'up' },
          { label: 'Consumer Retail Margins', direction: 'down' },
        ],
        bulletPoints: [
          'Logistics operators institute mandatory fuel surcharges',
          'Bank of England models prolonged cost-push inflation trajectory.',
        ],
        sources: ['Reuters', 'Bloomberg'],
        confidence: 'High',
        confidenceScore: 92,
        affectedSectors: ['Integrated Energy', 'Retail Supermarkets', 'Aviation'],
        keyTickers: [
          { ticker: 'BP', change: '+3.9%', positive: true },
          { ticker: 'SHEL', change: '+3.6%', positive: true },
          { ticker: 'IAG', change: '-4.7%', positive: false },
        ],
        quantMetric: 'CAR (5d): -3.6% | Corr: +0.78 | p < 0.01',
        summary: 'UK energy majors post robust trading earnings while aviation and retail logistics face substantial cost inflation.',
      },
      china: {
        countryName: 'China',
        eventTitle: 'Downstream Refining Margins & Strategic Inventories',
        chainGraph: [
          { label: 'Crude Benchmark', direction: 'up' },
          { label: 'Refinery Input Costs', direction: 'up' },
          { label: 'Polymers & Plastics', direction: 'down' },
        ],
        bulletPoints: [
          'State refineries recalibrate operating rates and export quotas',
          'Strategic coastal petroleum reserves cushion domestic supply.',
        ],
        sources: ['Caixin', 'Bloomberg'],
        confidence: 'High',
        confidenceScore: 91,
        affectedSectors: ['Refining & Chemicals', 'Logistics', 'Civil Aviation'],
        keyTickers: [
          { ticker: 'PETROCHINA', change: '+3.2%', positive: true },
          { ticker: 'AIR CHINA', change: '-4.1%', positive: false },
        ],
        quantMetric: 'CAR (5d): -2.7% | Corr: +0.74 | p < 0.05',
        summary: 'World largest crude importer navigates petrochemical feedstocks inflation by adjusting product export quotas.',
      },
      singapore: {
        countryName: 'Singapore',
        eventTitle: 'Bunker Fuel Escalation & Maritime Freight',
        chainGraph: [
          { label: 'Marine Fuel Prices', direction: 'up' },
          { label: 'Bunker Surcharges', direction: 'up' },
          { label: 'Air & Sea Carrier Profits', direction: 'down' },
        ],
        bulletPoints: [
          'Key maritime refueling hub handles higher dollar transaction volumes',
          'Flagship air carrier hedges soften immediate jet fuel escalation.',
        ],
        sources: ['Straits Times', 'Bloomberg'],
        confidence: 'High',
        confidenceScore: 94,
        affectedSectors: ['Marine Bunkering', 'Aviation', 'Commodity Trading'],
        keyTickers: [
          { ticker: 'SIA', change: '-4.3%', positive: false },
          { ticker: 'SMM', change: '+2.1%', positive: true },
        ],
        quantMetric: 'CAR (5d): -3.1% | Corr: +0.81 | p < 0.01',
        summary: 'Singapore global trading desks absorb bunker fuel volatility with heightened derivative hedging activity.',
      },
    },
  },
  covid_19: {
    id: 'covid_19',
    label: 'COVID‑19',
    subtitle: 'Mobility restrictions freeze global transit, accelerating remote infrastructure',
    defaultCountryId: 'china',
    connections: [
      { from: 'china', to: 'usa', type: 'supply_chain', intensity: 1.0 },
      { from: 'china', to: 'germany', type: 'supply_chain', intensity: 0.9 },
      { from: 'china', to: 'india', type: 'supply_chain', intensity: 0.85 },
      { from: 'china', to: 'japan', type: 'supply_chain', intensity: 0.8 },
      { from: 'usa', to: 'uk', type: 'supply_chain', intensity: 0.75 },
      { from: 'germany', to: 'france', type: 'supply_chain', intensity: 0.8 },
      { from: 'usa', to: 'singapore', type: 'supply_chain', intensity: 0.7 },
    ],
    countryData: {
      china: {
        countryName: 'China',
        eventTitle: 'Factory Lockdowns & Component Bottlenecks',
        chainGraph: [
          { label: 'Factory Closures', direction: 'up' },
          { label: 'Component Exports', direction: 'down' },
          { label: 'Global Supply Chain Bottlenecks', direction: 'up' },
        ],
        bulletPoints: [
          'Port congestions trigger worldwide shipping delays',
          'Semiconductor and electronic assemblies halted.',
        ],
        sources: ['Reuters', 'Nikkei Asia'],
        confidence: 'High',
        confidenceScore: 98,
        affectedSectors: ['Electronics Assembly', 'Container Shipping', 'E-Commerce Platforms'],
        keyTickers: [
          { ticker: 'FOXCONN', change: '-5.8%', positive: false },
          { ticker: 'COSCO', change: '+7.9%', positive: true },
          { ticker: 'BABA', change: '+3.8%', positive: true },
        ],
        quantMetric: 'CAR (5d): -7.4% (Manufacturing) | Corr: +0.91 | p < 0.001',
        summary: 'Lockdowns across manufacturing epicenters choke intermediate electronics parts and delay international shipping routes.',
      },
      india: {
        countryName: 'India',
        eventTitle: 'Pharma API Surge & Remote Work Acceleration',
        chainGraph: [
          { label: 'Mobility Restrictions', direction: 'up' },
          { label: 'Pharma API Demand', direction: 'up' },
          { label: 'IT Remote Services Revenue', direction: 'up' },
        ],
        bulletPoints: [
          'Generic drug manufacturers expand production shifts',
          'Domestic aviation and hospitality experience severe drawdown.',
        ],
        sources: ['Economic Times', 'Bloomberg'],
        confidence: 'High',
        confidenceScore: 95,
        affectedSectors: ['Pharmaceuticals', 'IT Outsourcing', 'Aviation & Hotels'],
        keyTickers: [
          { ticker: 'SUNPHARMA', change: '+6.8%', positive: true },
          { ticker: 'TCS', change: '+4.5%', positive: true },
          { ticker: 'INDIGO', change: '-12.4%', positive: false },
        ],
        quantMetric: 'CAR (5d): +5.1% (Pharma/IT) | Corr: +0.86 | p < 0.01',
        summary: 'India generic pharmaceutical powerhouses experience soaring international orders while IT firms migrate 95% of engineers to cloud remote workflows.',
      },
      usa: {
        countryName: 'United States',
        eventTitle: 'Cloud Software Boom & Travel Sector Collapse',
        chainGraph: [
          { label: 'Mobility Restrictions', direction: 'up' },
          { label: 'Cloud Software Demand', direction: 'up' },
          { label: 'Hospitality & Airlines', direction: 'down' },
        ],
        bulletPoints: [
          'Federal Reserve slashes rates to zero with historic quantitative easing',
          'Remote collaboration valuations surge while airlines receive federal aid.',
        ],
        sources: ['Bloomberg', 'CNBC'],
        confidence: 'High',
        confidenceScore: 97,
        affectedSectors: ['Enterprise Cloud', 'E-Commerce', 'Passenger Airlines', 'Lodging'],
        keyTickers: [
          { ticker: 'ZM', change: '+24.6%', positive: true },
          { ticker: 'AMZN', change: '+12.4%', positive: true },
          { ticker: 'AAL', change: '-21.8%', positive: false },
          { ticker: 'MAR', change: '-16.5%', positive: false },
        ],
        quantMetric: 'CAR (5d): -8.2% (Travel) / +14.1% (SaaS) | Corr: +0.94 | p < 0.001',
        summary: 'Unprecedented fiscal stimulus combined with stay-at-home orders fuels massive dispersion between tech winners and travel losers.',
      },
      germany: {
        countryName: 'Germany',
        eventTitle: 'Automotive Halts & Just-In-Time Breakdowns',
        chainGraph: [
          { label: 'Chip & Harness Shortage', direction: 'up' },
          { label: 'Assembly Line Idling', direction: 'up' },
          { label: 'Vehicle Deliveries', direction: 'down' },
        ],
        bulletPoints: [
          'Just-in-time supply chain disruption halts auto production lines',
          'Government activates Kurzarbeit state wage protection programs.',
        ],
        sources: ['Handelsblatt', 'Financial Times'],
        confidence: 'High',
        confidenceScore: 96,
        affectedSectors: ['Automotive OEM', 'Heavy Machinery', 'Industrial Components'],
        keyTickers: [
          { ticker: 'VOW', change: '-8.6%', positive: false },
          { ticker: 'BMW', change: '-7.9%', positive: false },
        ],
        quantMetric: 'CAR (5d): -6.7% | Corr: +0.88 | p < 0.01',
        summary: 'Critical shortages of imported electronic harnesses and microchips force temporary shutdowns across European car plants.',
      },
      uk: {
        countryName: 'United Kingdom',
        eventTitle: 'High Street Lockdown & Grocery Delivery Surge',
        chainGraph: [
          { label: 'Store Footfall', direction: 'down' },
          { label: 'Online Delivery Orders', direction: 'up' },
          { label: 'Commercial Property Rents', direction: 'down' },
        ],
        bulletPoints: [
          'Central London office occupancy drops beneath 15%',
          'Online supermarket fulfillment platforms scale capacity at record speed.',
        ],
        sources: ['BBC News', 'Reuters'],
        confidence: 'High',
        confidenceScore: 93,
        affectedSectors: ['Commercial Real Estate', 'Online Grocery', 'Travel Services'],
        keyTickers: [
          { ticker: 'OCADO', change: '+15.2%', positive: true },
          { ticker: 'IAG', change: '-18.4%', positive: false },
          { ticker: 'LAND', change: '-10.8%', positive: false },
        ],
        quantMetric: 'CAR (5d): -7.1% | Corr: +0.85 | p < 0.01',
        summary: 'Drastic shift from physical commercial centers to digital grocery infrastructure tests commercial property values.',
      },
      japan: {
        countryName: 'Japan',
        eventTitle: 'Inbound Tourism Halt & Component Prioritization',
        chainGraph: [
          { label: 'Inbound Tourism', direction: 'down' },
          { label: 'Hospitality Earnings', direction: 'down' },
          { label: 'Electronics Component Demand', direction: 'up' },
        ],
        bulletPoints: [
          'Border closures halt international tourism across Tokyo and Kyoto',
          'Component makers see surging global orders for home laptops and displays.',
        ],
        sources: ['Nikkei Asia', 'Bloomberg'],
        confidence: 'High',
        confidenceScore: 92,
        affectedSectors: ['Airlines', 'Hospitality', 'Passive Electronic Components'],
        keyTickers: [
          { ticker: 'JAL', change: '-15.1%', positive: false },
          { ticker: 'MURATA', change: '+4.2%', positive: true },
        ],
        quantMetric: 'CAR (5d): -5.3% | Corr: +0.80 | p < 0.05',
        summary: 'Sharp domestic travel decline countered by resilient global electronics export component demand.',
      },
    },
  },
  rate_hike: {
    id: 'rate_hike',
    label: 'Interest Rate Hike',
    subtitle: 'Central banks lift policy rates to curb inflation, repricing equity valuations',
    defaultCountryId: 'usa',
    connections: [
      { from: 'usa', to: 'germany', type: 'capital_flow', intensity: 1.0 },
      { from: 'usa', to: 'india', type: 'capital_flow', intensity: 0.9 },
      { from: 'usa', to: 'uk', type: 'capital_flow', intensity: 0.85 },
      { from: 'usa', to: 'japan', type: 'capital_flow', intensity: 0.8 },
      { from: 'usa', to: 'brazil', type: 'capital_flow', intensity: 0.75 },
      { from: 'germany', to: 'uk', type: 'capital_flow', intensity: 0.7 },
      { from: 'usa', to: 'singapore', type: 'capital_flow', intensity: 0.7 },
    ],
    countryData: {
      usa: {
        countryName: 'United States',
        eventTitle: 'Federal Reserve Quantitative Tightening',
        chainGraph: [
          { label: 'Fed Funds Rate', direction: 'up' },
          { label: 'Treasury Yields', direction: 'up' },
          { label: 'Tech Equity Multiples', direction: 'down' },
        ],
        bulletPoints: [
          'Cost of capital increases for unprofitable growth companies',
          'Mortgage demand hits multi-decade lows as borrowing costs spike.',
        ],
        sources: ['Wall Street Journal', 'Bloomberg'],
        confidence: 'High',
        confidenceScore: 96,
        affectedSectors: ['Growth Tech', 'Regional Banks', 'Residential Real Estate'],
        keyTickers: [
          { ticker: 'QQQ', change: '-4.6%', positive: false },
          { ticker: 'JPM', change: '+3.2%', positive: true },
          { ticker: 'ARKK', change: '-8.9%', positive: false },
          { ticker: 'DHI', change: '-5.4%', positive: false },
        ],
        quantMetric: 'CAR (5d): -5.1% | Corr: +0.90 | p < 0.001',
        summary: 'Aggressive 75 bps Fed rate increases drive benchmark 10Y yields upwards, compressing PE valuation multiples across high-duration tech equities.',
      },
      india: {
        countryName: 'India',
        eventTitle: 'Rupee Pressure & RBI Repo Tightening',
        chainGraph: [
          { label: 'US 10Y Yields', direction: 'up' },
          { label: 'FII Capital Outflows', direction: 'up' },
          { label: 'RBI Repo Rate Hikes', direction: 'up' },
        ],
        bulletPoints: [
          'Central bank deploys FX reserves to buffer currency slide',
          'Banking net interest margins benefit from rate transmission.',
        ],
        sources: ['Reuters', 'Livemint'],
        confidence: 'High',
        confidenceScore: 94,
        affectedSectors: ['Banking & NBFCs', 'IT Exporters', 'Real Estate'],
        keyTickers: [
          { ticker: 'HDFCBANK', change: '+2.4%', positive: true },
          { ticker: 'ICICIBANK', change: '+2.8%', positive: true },
          { ticker: 'INFY', change: '-3.7%', positive: false },
          { ticker: 'DLF', change: '-4.9%', positive: false },
        ],
        quantMetric: 'CAR (5d): -2.8% | Corr: +0.82 | p < 0.01',
        summary: 'Higher US yields spur foreign institutional portfolio outflows from emerging equities, compelling RBI repo increases to protect the rupee.',
      },
      germany: {
        countryName: 'Germany',
        eventTitle: 'ECB Rate Transition & Sovereign Spreads',
        chainGraph: [
          { label: 'ECB Deposit Rate', direction: 'up' },
          { label: 'Bund Yields', direction: 'up' },
          { label: 'Corporate Borrowing Costs', direction: 'up' },
        ],
        bulletPoints: [
          'End of negative deposit rate era restores commercial lending margins',
          'Industrial debt refinancing costs rise across the Eurozone.',
        ],
        sources: ['Financial Times', 'Reuters'],
        confidence: 'High',
        confidenceScore: 93,
        affectedSectors: ['Commercial Banking', 'Enterprise Software', 'Real Estate Funds'],
        keyTickers: [
          { ticker: 'DBK', change: '+3.9%', positive: true },
          { ticker: 'SAP', change: '-3.4%', positive: false },
          { ticker: 'VNA', change: '-7.2%', positive: false },
        ],
        quantMetric: 'CAR (5d): -3.4% | Corr: +0.84 | p < 0.01',
        summary: 'ECB historic exit from negative interest rates revitalizes banking net interest margins while repricing leveraged real estate trusts.',
      },
      japan: {
        countryName: 'Japan',
        eventTitle: 'Yield Curve Control & Historical Yen Weakness',
        chainGraph: [
          { label: 'US-JP Rate Spread', direction: 'up' },
          { label: 'Yen (JPY)', direction: 'down' },
          { label: 'Export Corporate Profits', direction: 'up' },
        ],
        bulletPoints: [
          'Automakers experience foreign currency translation windfall gains',
          'Imported food and fuel inflation challenges domestic households.',
        ],
        sources: ['Nikkei Asia', 'Bloomberg'],
        confidence: 'High',
        confidenceScore: 91,
        affectedSectors: ['Automotive Exporters', 'Mega-banks', 'Retail Import'],
        keyTickers: [
          { ticker: 'TM', change: '+4.3%', positive: true },
          { ticker: 'MUFG', change: '+4.8%', positive: true },
          { ticker: 'FASTRETAIL', change: '-3.2%', positive: false },
        ],
        quantMetric: 'CAR (5d): +3.2% (Exporters) | Corr: +0.87 | p < 0.01',
        summary: 'Bank of Japan continuation of yield curve control widens rate differential with US, driving the Yen to 30-year lows and boosting exporter profits.',
      },
      uk: {
        countryName: 'United Kingdom',
        eventTitle: 'Bank Rate Escalation & Mortgage Repricing',
        chainGraph: [
          { label: 'BoE Policy Rate', direction: 'up' },
          { label: 'Gilt Yields', direction: 'up' },
          { label: 'Fixed Mortgage Rates', direction: 'up' },
        ],
        bulletPoints: [
          'Housing transaction volumes contract as mortgage rates exceed 6%',
          'High street banks expand net interest margins on retail deposits.',
        ],
        sources: ['Bloomberg', 'Reuters'],
        confidence: 'High',
        confidenceScore: 95,
        affectedSectors: ['Mortgage Lenders', 'Homebuilders', 'Commercial Banks'],
        keyTickers: [
          { ticker: 'BARC', change: '+3.2%', positive: true },
          { ticker: 'LLOY', change: '+2.7%', positive: true },
          { ticker: 'BKG', change: '-6.1%', positive: false },
        ],
        quantMetric: 'CAR (5d): -4.6% | Corr: +0.86 | p < 0.01',
        summary: 'Bank of England consecutive rate increments lift mortgage servicing costs, cooling residential property demand.',
      },
      brazil: {
        countryName: 'Brazil',
        eventTitle: 'Selic Real Rate Buffer & Carry Trade Capital',
        chainGraph: [
          { label: 'Fed Tightening', direction: 'up' },
          { label: 'Selic Double-Digit Spread', direction: 'up' },
          { label: 'Carry Trade Capital Inflows', direction: 'up' },
        ],
        bulletPoints: [
          'Aggressive early domestic rate hikes insulate the Brazilian Real',
          'Elevated debt servicing costs burden leveraged retail consumers.',
        ],
        sources: ['Valor Econômico', 'Bloomberg'],
        confidence: 'Medium',
        confidenceScore: 89,
        affectedSectors: ['Banking', 'Commodity Mining', 'Consumer Retail'],
        keyTickers: [
          { ticker: 'ITUB', change: '+2.6%', positive: true },
          { ticker: 'VALE', change: '+1.9%', positive: true },
          { ticker: 'MGLU', change: '-7.4%', positive: false },
        ],
        quantMetric: 'CAR (5d): -1.9% | Corr: +0.75 | p < 0.05',
        summary: 'Brazil early and aggressive monetary response provides wide interest rate buffer that protects currency stability during Fed tightening.',
      },
    },
  },
};
