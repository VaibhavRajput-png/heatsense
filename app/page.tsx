"use client";

import { useState, useEffect } from "react";

function LiveClock() {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      <span>Last updated: {time}</span>
    </div>
  );
}

function LoadingBar({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;
  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 bg-[#0a0a0f] z-[100] overflow-hidden">
      <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-loading-bar" />
    </div>
  );
}

function StatCard({ title, value, unit, icon, variant = "orange" }: {
  title: string; value: string; unit: string; icon: React.ReactNode; variant?: "orange" | "red";
}) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-xl border p-6 transition-all duration-500 hover:scale-[1.03] cursor-pointer ${
        variant === "red"
          ? `border-red-500/30 card-gradient-red ${isHovered ? "animate-glow-intense-red" : "animate-glow-pulse-red"}`
          : `border-orange-500/30 card-gradient-orange ${isHovered ? "animate-glow-intense" : "animate-glow-pulse"}`
      }`}
    >
      <div className="absolute inset-0 rounded-xl animate-shimmer pointer-events-none" />
      <div className={`absolute inset-0 rounded-xl transition-opacity duration-500 pointer-events-none ${isHovered ? "opacity-100" : "opacity-0"}`}
        style={{ background: variant === "red" ? "radial-gradient(circle at center, rgba(239,68,68,0.1) 0%, transparent 70%)" : "radial-gradient(circle at center, rgba(249,115,22,0.1) 0%, transparent 70%)" }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{title}</span>
          <div className={`p-2.5 rounded-lg transition-all duration-300 ${variant === "red" ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"} ${isHovered ? "scale-110" : ""}`}>{icon}</div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-5xl font-extrabold tracking-tight ${variant === "red" ? "text-red-500" : "text-orange-500"}`}>{value}</span>
          {unit && <span className="text-lg font-medium text-gray-500 ml-1">{unit}</span>}
        </div>
      </div>
    </div>
  );
}

function HeatZoneItem({ zone, temp, severity }: { zone: string; temp: string; severity: "high" | "critical" | "moderate" }) {
  const severityStyles = { critical: "bg-red-500/20 text-red-400 border-red-500/30", high: "bg-orange-500/20 text-orange-400 border-orange-500/30", moderate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" };
  const severityDot = { critical: "bg-red-500", high: "bg-orange-500", moderate: "bg-yellow-500" };
  return (
    <div className="group flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#0f0f14] to-[#111118] border border-gray-800/50 hover:border-orange-500/40 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className={`w-2.5 h-2.5 rounded-full ${severityDot[severity]} animate-pulse`} />
        <span className="text-gray-200 font-medium group-hover:text-white transition-colors">{zone}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-orange-500 font-mono font-bold text-lg">{temp}</span>
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${severityStyles[severity]}`}>{severity.toUpperCase()}</span>
      </div>
    </div>
  );
}

function TemperatureLegend() {
  return (
    <div className="absolute bottom-4 left-4 bg-[#0a0a0f]/90 backdrop-blur-sm rounded-lg p-3 border border-gray-800/50">
      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-semibold">Temperature Scale</p>
      <div className="w-32 h-3 rounded-full" style={{ background: "linear-gradient(to right, #22c55e, #eab308, #f97316, #ef4444, #7f1d1d)" }} />
      <div className="flex justify-between mt-1 text-[9px] text-gray-500 font-mono"><span>25°C</span><span>35°C</span><span>45°C</span><span>55°C</span></div>
    </div>
  );
}

function ThermalMap({ city }: { city: string }) {
  return (
    <div className="h-[380px] relative overflow-hidden bg-[#080810] rounded-b-xl">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(rgba(249,115,22,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.4) 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />
      <div className="absolute top-2 left-2 text-[8px] font-mono text-orange-500/40">28.6139°N</div>
      <div className="absolute top-2 right-2 text-[8px] font-mono text-orange-500/40">77.2090°E</div>
      <div className="absolute bottom-12 left-2 text-[8px] font-mono text-orange-500/40">28.4089°N</div>
      <div className="absolute bottom-12 right-2 text-[8px] font-mono text-orange-500/40">77.4090°E</div>
      <div className="absolute w-48 h-48 rounded-full opacity-70" style={{ background: "radial-gradient(circle, rgba(239,68,68,0.8) 0%, rgba(239,68,68,0) 70%)", top: "20%", left: "30%" }} />
      <div className="absolute w-36 h-36 rounded-full opacity-60" style={{ background: "radial-gradient(circle, rgba(249,115,22,0.8) 0%, rgba(249,115,22,0) 70%)", top: "45%", left: "55%" }} />
      <div className="absolute w-40 h-40 rounded-full opacity-65" style={{ background: "radial-gradient(circle, rgba(234,179,8,0.7) 0%, rgba(234,179,8,0) 70%)", top: "60%", left: "20%" }} />
      <div className="absolute w-28 h-28 rounded-full opacity-50" style={{ background: "radial-gradient(circle, rgba(249,115,22,0.7) 0%, rgba(249,115,22,0) 70%)", top: "15%", left: "65%" }} />
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent animate-scan-line" />
      <TemperatureLegend />
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#0a0a0f]/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-orange-500/20">
        <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
        <span className="text-orange-500 text-xs font-medium">LIVE</span>
      </div>
      <div className="absolute" style={{ top: "25%", left: "35%" }}>
        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
        <div className="absolute -top-6 -left-8 bg-[#0a0a0f]/90 px-2 py-1 rounded text-[10px] font-mono text-red-400 whitespace-nowrap border border-red-500/30">42.8°C</div>
      </div>
      <div className="absolute" style={{ top: "50%", left: "60%" }}>
        <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
        <div className="absolute -top-6 -left-8 bg-[#0a0a0f]/90 px-2 py-1 rounded text-[10px] font-mono text-orange-400 whitespace-nowrap border border-orange-500/30">39.4°C</div>
      </div>
      <div className="absolute" style={{ top: "65%", left: "25%" }}>
        <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
        <div className="absolute -top-6 -left-8 bg-[#0a0a0f]/90 px-2 py-1 rounded text-[10px] font-mono text-yellow-400 whitespace-nowrap border border-yellow-500/30">36.2°C</div>
      </div>
    </div>
  );
}

function ForecastStrip({ forecast }: { forecast: { day: string; temp: number; humidity: number }[] }) {
  const maxTemp = Math.max(...forecast.map(f => f.temp));
  const minTemp = Math.min(...forecast.map(f => f.temp));
  const getColor = (temp: number) => {
    if (temp >= 40) return "bg-red-500";
    if (temp >= 35) return "bg-orange-500";
    if (temp >= 30) return "bg-yellow-500";
    return "bg-green-500";
  };
  return (
    <div className="rounded-xl border border-gray-800/50 bg-gradient-to-br from-[#12121a] to-[#0f0f14] p-6 shadow-lg mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-lg bg-orange-500/10">
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-200">5-Day Heat Forecast</h2>
        <span className="ml-auto text-xs text-gray-500 font-mono">Heat trend analysis</span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {forecast.map((f, i) => (
          <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-[#0f0f14] border border-gray-800/50 hover:border-orange-500/30 transition-all">
            <span className="text-xs text-gray-400 font-mono">{f.day}</span>
            <div className="w-full bg-gray-800 rounded-full h-20 flex flex-col-reverse overflow-hidden">
              <div
                className={`w-full rounded-full transition-all duration-1000 ${getColor(f.temp)}`}
                style={{ height: `${((f.temp - minTemp) / (maxTemp - minTemp + 1)) * 100 + 20}%`, opacity: 0.8 }}
              />
            </div>
            <span className={`text-sm font-bold font-mono ${f.temp >= 40 ? "text-red-400" : f.temp >= 35 ? "text-orange-400" : "text-yellow-400"}`}>{f.temp}°C</span>
            <span className="text-[10px] text-gray-500">{f.humidity}% 💧</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIAnalysisCard({ analysis, isLoading }: { analysis: string; isLoading: boolean }) {
  return (
    <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-[#12121a] via-[#14121d] to-[#12121a] p-6 shadow-lg shadow-orange-500/5">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20">
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-200">AI Analysis</h2>
        <span className="ml-auto px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 text-orange-500 text-xs font-semibold border border-orange-500/20 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse inline-block" />
          Claude Powered
        </span>
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-4 bg-gray-800 rounded animate-pulse" style={{ width: `${85 - i*10}%` }} />
          ))}
          <p className="text-xs text-orange-400/60 font-mono mt-4">Claude is analyzing heat data...</p>
        </div>
      ) : (
        <div className="space-y-3 text-gray-300 leading-relaxed text-sm">
          {analysis.split('\n').filter(Boolean).map((line, i) => (
            <p key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>{line.replace(/^[•\-\*]\s*/, '')}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// NEW: Heat Advisory Panel
function HeatAdvisoryPanel({ riskLabel }: { riskLabel: string }) {
  const advisories: Record<string, { color: string; border: string; icon: string; tips: string[] }> = {
    CRITICAL: {
      color: "text-red-400",
      border: "border-red-500/30",
      icon: "🚨",
      tips: [
        "Avoid all outdoor activity between 11AM–5PM",
        "Seek air-conditioned spaces immediately",
        "Check on elderly neighbors and children",
        "Emergency cooling centers are open citywide",
      ],
    },
    HIGH: {
      color: "text-orange-400",
      border: "border-orange-500/30",
      icon: "⚠️",
      tips: [
        "Limit strenuous outdoor activity",
        "Drink water every 20 minutes even if not thirsty",
        "Wear light, loose-fitting clothing",
        "Never leave children or pets in parked vehicles",
      ],
    },
    MODERATE: {
      color: "text-yellow-400",
      border: "border-yellow-500/30",
      icon: "🌤️",
      tips: [
        "Stay hydrated throughout the day",
        "Take breaks in shade during outdoor activity",
        "Monitor local heat index updates",
        "Wear sunscreen and a hat outdoors",
      ],
    },
    LOW: {
      color: "text-green-400",
      border: "border-green-500/30",
      icon: "✅",
      tips: [
        "Conditions are relatively comfortable",
        "Stay hydrated as a general precaution",
        "Enjoy outdoor activities with normal care",
        "Monitor forecast for upcoming heat changes",
      ],
    },
  };
  const advisory = advisories[riskLabel] || advisories["LOW"];
  return (
    <div className={`rounded-xl border ${advisory.border} bg-gradient-to-br from-[#12121a] to-[#0f0f14] p-6 shadow-lg mb-8`}>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">{advisory.icon}</span>
        <h2 className="text-lg font-semibold text-gray-200">Heat Advisory</h2>
        <span className={`ml-auto text-xs font-bold font-mono uppercase ${advisory.color}`}>{riskLabel} RISK</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {advisory.tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-[#0a0a0f]/60 border border-gray-800/40">
            <span className={`mt-0.5 flex-shrink-0 text-xs font-bold font-mono ${advisory.color}`}>{String(i + 1).padStart(2, '0')}</span>
            <span className="text-gray-300 text-xs leading-relaxed">{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// NEW: City Comparison Panel
type CitySnapshot = {
  name: string;
  temp: number;
  humidity: number;
  heatIndex: number;
  riskLabel: string;
  windSpeed: number;
};

function CityComparisonPanel({ API_KEY, calcHeatIndex, getRiskLevel }: {
  API_KEY: string | undefined;
  calcHeatIndex: (t: number, h: number) => number;
  getRiskLevel: (hi: number) => { label: string; variant: "red" | "orange" };
}) {
  const [cityA, setCityA] = useState("");
  const [cityB, setCityB] = useState("");
  const [dataA, setDataA] = useState<CitySnapshot | null>(null);
  const [dataB, setDataB] = useState<CitySnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSnapshot = async (name: string): Promise<CitySnapshot | null> => {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(name)}&appid=${API_KEY}&units=metric`);
    if (!res.ok) return null;
    const d = await res.json();
    const temp = Math.round(d.main.temp * 10) / 10;
    const humidity = d.main.humidity;
    const heatIndex = calcHeatIndex(temp, humidity);
    const risk = getRiskLevel(heatIndex);
    return { name: d.name, temp, humidity, heatIndex, riskLabel: risk.label, windSpeed: Math.round(d.wind.speed * 3.6 * 10) / 10 };
  };

  const compare = async () => {
    if (!cityA.trim() || !cityB.trim()) { setError("Enter both cities."); return; }
    setLoading(true); setError(""); setDataA(null); setDataB(null);
    const [a, b] = await Promise.all([fetchSnapshot(cityA), fetchSnapshot(cityB)]);
    if (!a || !b) { setError("One or both cities not found."); setLoading(false); return; }
    setDataA(a); setDataB(b); setLoading(false);
  };

  const hotter = dataA && dataB ? (dataA.heatIndex >= dataB.heatIndex ? dataA.name : dataB.name) : null;

  const MetricRow = ({ label, valA, valB, unit }: { label: string; valA: number; valB: number; unit: string }) => {
    const winnerA = valA >= valB;
    return (
      <div className="grid grid-cols-3 items-center gap-2 py-2 border-b border-gray-800/40">
        <span className={`text-right text-sm font-mono font-bold ${winnerA ? "text-red-400" : "text-gray-400"}`}>{valA}{unit}</span>
        <span className="text-center text-[10px] text-gray-500 uppercase tracking-wider">{label}</span>
        <span className={`text-left text-sm font-mono font-bold ${!winnerA ? "text-red-400" : "text-gray-400"}`}>{valB}{unit}</span>
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-gray-800/50 bg-gradient-to-br from-[#12121a] to-[#0f0f14] p-6 shadow-lg mb-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-lg bg-orange-500/10">
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-200">City vs City Comparison</h2>
      </div>
      <div className="flex gap-3 mb-4">
        <input
          placeholder="City A (e.g. Mumbai)"
          value={cityA} onChange={e => setCityA(e.target.value)}
          onKeyDown={e => e.key === "Enter" && compare()}
          className="flex-1 px-4 py-2.5 rounded-lg bg-[#12121a] border border-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-sm"
        />
        <span className="flex items-center text-gray-500 font-bold">vs</span>
        <input
          placeholder="City B (e.g. Chennai)"
          value={cityB} onChange={e => setCityB(e.target.value)}
          onKeyDown={e => e.key === "Enter" && compare()}
          className="flex-1 px-4 py-2.5 rounded-lg bg-[#12121a] border border-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-sm"
        />
        <button onClick={compare} disabled={loading}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:scale-105 disabled:opacity-50 text-sm">
          {loading ? "..." : "Compare"}
        </button>
      </div>
      {error && <p className="text-red-400 text-xs font-mono mb-3">{error}</p>}
      {dataA && dataB && (
        <div>
          {hotter && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
              <span className="text-red-400 font-bold text-sm">🔥 {hotter} is hotter by {Math.abs(dataA.heatIndex - dataB.heatIndex).toFixed(1)}°C heat index</span>
            </div>
          )}
          <div className="grid grid-cols-3 mb-2">
            <span className="text-center text-sm font-bold text-orange-400">{dataA.name}</span>
            <span className="text-center text-[10px] text-gray-600 uppercase">Metric</span>
            <span className="text-center text-sm font-bold text-orange-400">{dataB.name}</span>
          </div>
          <MetricRow label="Temperature" valA={dataA.temp} valB={dataB.temp} unit="°C" />
          <MetricRow label="Humidity" valA={dataA.humidity} valB={dataB.humidity} unit="%" />
          <MetricRow label="Heat Index" valA={dataA.heatIndex} valB={dataB.heatIndex} unit="°C" />
          <MetricRow label="Wind km/h" valA={dataA.windSpeed} valB={dataB.windSpeed} unit="" />
          <div className="grid grid-cols-3 items-center gap-2 pt-2">
            <span className={`text-center text-xs font-bold px-2 py-1 rounded-full border ${dataA.riskLabel === "CRITICAL" || dataA.riskLabel === "HIGH" ? "text-red-400 border-red-500/30 bg-red-500/10" : "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"}`}>{dataA.riskLabel}</span>
            <span className="text-center text-[10px] text-gray-500 uppercase">Risk</span>
            <span className={`text-center text-xs font-bold px-2 py-1 rounded-full border ${dataB.riskLabel === "CRITICAL" || dataB.riskLabel === "HIGH" ? "text-red-400 border-red-500/30 bg-red-500/10" : "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"}`}>{dataB.riskLabel}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function calcHeatIndex(tempC: number, humidity: number): number {
  const T = tempC * 9/5 + 32;
  const R = humidity;
  const HI = -42.379 + 2.04901523*T + 10.14333127*R - 0.22475541*T*R - 0.00683783*T*T - 0.05481717*R*R + 0.00122874*T*T*R + 0.00085282*T*R*R - 0.00000199*T*T*R*R;
  return Math.round(((HI - 32) * 5/9) * 10) / 10;
}

function getRiskLevel(heatIndex: number): { label: string; variant: "red" | "orange" } {
  if (heatIndex >= 41) return { label: "CRITICAL", variant: "red" };
  if (heatIndex >= 35) return { label: "HIGH", variant: "red" };
  if (heatIndex >= 30) return { label: "MODERATE", variant: "orange" };
  return { label: "LOW", variant: "orange" };
}

export default function HeatSenseDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [city, setCity] = useState("Delhi");
  const [error, setError] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("Search for a city to get AI-powered heat island analysis from Claude.");
  const [forecast, setForecast] = useState<{ day: string; temp: number; humidity: number }[]>([
    { day: "Today", temp: 38, humidity: 72 },
    { day: "Tue", temp: 40, humidity: 68 },
    { day: "Wed", temp: 42, humidity: 65 },
    { day: "Thu", temp: 39, humidity: 70 },
    { day: "Fri", temp: 36, humidity: 75 },
  ]);
  const [weatherData, setWeatherData] = useState({
    temp: 38.5, humidity: 72, heatIndex: 42.3, riskLabel: "HIGH", riskVariant: "red" as "red" | "orange", windSpeed: 14.4,
  });

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  useEffect(() => { setTimeout(() => setIsLoading(false), 2000); }, []);

  const fetchClaudeAnalysis = async (cityName: string, temp: number, humidity: number, heatIndex: number, riskLabel: string) => {
    setIsAILoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are an urban heat island expert AI. Analyze this city's heat data and give exactly 3 short insights separated by newlines (no bullet symbols). Be specific, data-driven, mention actionable recommendations. City: ${cityName}, Temperature: ${temp}°C, Humidity: ${humidity}%, Heat Index: ${heatIndex}°C, Risk Level: ${riskLabel}. Keep each insight to 1-2 sentences max.`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || "Analysis unavailable.";
      setAiAnalysis(text);
    } catch {
      setAiAnalysis(`${cityName} is experiencing ${riskLabel.toLowerCase()} heat stress. Heat index of ${heatIndex}°C with ${humidity}% humidity requires attention.\nPeak heat stress window predicted 13:00–17:00 local time. Recommend limiting outdoor activity.\nActivate cooling centers and ensure hydration access in public spaces throughout the day.`);
    } finally {
      setIsAILoading(false);
    }
  };

  const fetchWeather = async (cityName: string) => {
    if (!cityName.trim()) return;
    setIsFetching(true);
    setError("");
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`);
      if (!res.ok) throw new Error(res.status === 404 ? "City not found." : "Failed to fetch.");
      const data = await res.json();
      const temp = Math.round(data.main.temp * 10) / 10;
      const humidity = data.main.humidity;
      const heatIndex = calcHeatIndex(temp, humidity);
      const risk = getRiskLevel(heatIndex);
      const windSpeed = Math.round(data.wind.speed * 3.6 * 10) / 10; // m/s → km/h
      setCity(data.name);
      setWeatherData({ temp, humidity, heatIndex, riskLabel: risk.label, riskVariant: risk.variant, windSpeed });

      const fRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&cnt=40`);
      if (fRes.ok) {
        const fData = await fRes.json();
        const daily: { [key: string]: { temps: number[]; humidities: number[] } } = {};
        fData.list.forEach((item: { dt: number; main: { temp: number; humidity: number } }) => {
          const date = new Date(item.dt * 1000);
          const dayKey = date.toLocaleDateString("en-US", { weekday: "short" });
          if (!daily[dayKey]) daily[dayKey] = { temps: [], humidities: [] };
          daily[dayKey].temps.push(item.main.temp);
          daily[dayKey].humidities.push(item.main.humidity);
        });
        const forecastArr = Object.entries(daily).slice(0, 5).map(([day, vals], i) => ({
          day: i === 0 ? "Today" : day,
          temp: Math.round(Math.max(...vals.temps) * 10) / 10,
          humidity: Math.round(vals.humidities.reduce((a, b) => a + b, 0) / vals.humidities.length),
        }));
        if (forecastArr.length) setForecast(forecastArr);
      }

      fetchClaudeAnalysis(data.name, temp, humidity, heatIndex, risk.label);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsFetching(false);
    }
  };

  const zones = [
    { zone: `${city} Industrial District`, temp: `${(weatherData.temp + 4.3).toFixed(1)}°C`, severity: "critical" as const },
    { zone: `${city} Business Park`, temp: `${(weatherData.temp + 0.9).toFixed(1)}°C`, severity: "high" as const },
    { zone: `${city} Residential North`, temp: `${(weatherData.temp - 2.3).toFixed(1)}°C`, severity: "moderate" as const },
  ];

  return (
    <div className="min-h-screen animate-gradient-mesh text-white">
      <LoadingBar isLoading={isLoading || isFetching} />
      <nav className="sticky top-0 z-50 border-b border-gray-800/50 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full" />
                <span className="relative text-2xl font-bold bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent">HeatSense</span>
              </div>
              <span className="text-2xl">🌡️</span>
            </div>
            <LiveClock />
            <div className="flex items-center gap-3">
              <div className="relative">
                <input type="text" placeholder="Search city..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchWeather(searchQuery)}
                  className="w-64 px-4 py-2.5 rounded-lg bg-[#12121a] border border-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button onClick={() => fetchWeather(searchQuery)} disabled={isFetching}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:scale-105 disabled:opacity-50">
                {isFetching ? "..." : "Search"}
              </button>
            </div>
          </div>
          {error && <p className="text-red-400 text-xs mt-2 text-right font-mono">{error}</p>}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-gray-400 text-sm font-mono">Showing data for:</span>
          <span className="text-orange-400 font-bold text-sm">{city}</span>
        </div>

        {/* 5 stat cards now */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="Temperature" value={weatherData.temp.toString()} unit="°C"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
          />
          <StatCard title="Humidity" value={weatherData.humidity.toString()} unit="%"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>}
          />
          <StatCard title="Heat Index" value={weatherData.heatIndex.toString()} unit="°C" variant="red"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>}
          />
          <StatCard title="Wind Speed" value={weatherData.windSpeed.toString()} unit="km/h"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
          />
          <StatCard title="Risk Level" value={weatherData.riskLabel} unit="" variant={weatherData.riskVariant}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          />
        </div>

        <div className="mb-8">
          <div className="rounded-xl border border-gray-800/50 bg-[#12121a] overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-800/50 flex items-center justify-between bg-gradient-to-r from-[#12121a] to-[#0f0f14]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <h2 className="text-lg font-semibold text-gray-200">Thermal Heat Map</h2>
                <span className="text-xs text-gray-500 font-mono ml-2">{city} Region</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-green-400 text-xs font-medium">Connected</span>
              </div>
            </div>
            <ThermalMap city={city} />
          </div>
        </div>

        <ForecastStrip forecast={forecast} />

        {/* NEW: Heat Advisory */}
        <HeatAdvisoryPanel riskLabel={weatherData.riskLabel} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AIAnalysisCard analysis={aiAnalysis} isLoading={isAILoading} />
          <div className="rounded-xl border border-gray-800/50 bg-gradient-to-br from-[#12121a] to-[#0f0f14] p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-red-500/10">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-200">Heat Zones</h2>
              <span className="ml-auto px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20">3 Active Zones</span>
            </div>
            <div className="space-y-3">
              {zones.map((z, i) => <HeatZoneItem key={i} {...z} />)}
            </div>
          </div>
        </div>

        {/* NEW: City Comparison */}
        <CityComparisonPanel API_KEY={API_KEY} calcHeatIndex={calcHeatIndex} getRiskLevel={getRiskLevel} />

        <footer className="mt-12 pt-8 border-t border-gray-800/50">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="font-medium">© 2026 HeatSense Intelligence Platform</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>All systems operational</span>
              </div>
              <span className="text-gray-700">|</span>
              <span className="font-mono text-xs">v2.2.0</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
