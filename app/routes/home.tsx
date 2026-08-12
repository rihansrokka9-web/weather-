import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/home";

const OPEN_WEATHER_KEY = "73a49dfe4776fdd69fd11407a03f4b16";

const BACKGROUNDS = [
  { id: "clear", label: "Clear", style: { background: "radial-gradient(circle at top left, rgba(56,189,248,0.35), transparent 35%), linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" } },
  { id: "sunset", label: "Sunset", style: { background: "radial-gradient(circle at top left, rgba(251,146,60,0.32), transparent 30%), linear-gradient(135deg, #f97316 0%, #93291e 100%)" } },
  { id: "ocean", label: "Ocean", style: { background: "radial-gradient(circle at top left, rgba(14,165,233,0.3), transparent 30%), linear-gradient(135deg, #083f6b 0%, #0f172a 100%)" } },
  { id: "forest", label: "Forest", style: { background: "radial-gradient(circle at top left, rgba(34,197,94,0.3), transparent 30%), linear-gradient(135deg, #0f172a 0%, #064e3b 100%)" } },
];

function formatTime(timestamp: number, timezone: number) {
  return new Date((timestamp + timezone) * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toKm(meters: number) {
  return `${Math.round(meters / 1000)} km`;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Weather App" },
    { name: "description", content: "Responsive weather app with search, temperature units, and location details." },
  ];
}

export default function Home() {
  const [query, setQuery] = useState("New York");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [background, setBackground] = useState(BACKGROUNDS[0].id);

  const selectedBackground = BACKGROUNDS.find((bg) => bg.id === background) ?? BACKGROUNDS[0];

  const weatherDetails = useMemo(() => {
    if (!weather) return null;
    const tempC = weather.main.temp;
    const feelsC = weather.main.feels_like;
    const tempF = Math.round((tempC * 9) / 5 + 32);
    const feelsF = Math.round((feelsC * 9) / 5 + 32);

    return {
      tempC: Math.round(tempC),
      tempF,
      feelsC: Math.round(feelsC),
      feelsF,
      humidity: weather.main.humidity,
      pressure: weather.main.pressure,
      description: weather.weather?.[0]?.description,
      wind: weather.wind.speed,
      visibility: weather.visibility,
      sunrise: weather.sys.sunrise,
      sunset: weather.sys.sunset,
      country: weather.sys.country,
    };
  }, [weather]);

  async function fetchWeather(location: string) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${OPEN_WEATHER_KEY}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch weather data.");
      }

      const data = await response.json();
      setWeather(data);
    } catch (err: any) {
      setError(err?.message || "Unable to fetch weather.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWeather(query);
  }, []);

  return (
    <div className="space-y-6">
      <section
        style={selectedBackground.style}
        className="overflow-hidden rounded-[32px] border border-white/10 shadow-2xl shadow-slate-950/40"
      >
        <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <div className="max-w-3xl space-y-6 text-slate-100">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/90">Live Weather Dashboard</p>
            <h1 className="text-4xl font-semibold sm:text-5xl">Search weather for any location.</h1>
            <p className="max-w-2xl text-slate-200/90">
              Enter a location to see temperature in Celsius and Fahrenheit, humidity, pressure, and more.
            </p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              fetchWeather(query);
            }}
            className="mt-8 space-y-4"
          >
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <label className="sr-only" htmlFor="city-search">
                Search location
              </label>
              <input
                id="city-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4 text-slate-100 placeholder:text-slate-300 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                placeholder="Search city, region, or country"
              />
              <button
                type="submit"
                className="rounded-3xl bg-sky-400 px-6 py-4 font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Search
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setBackground(bg.id)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    background === bg.id
                      ? "border-sky-300 bg-white/10 text-white"
                      : "border-white/10 text-slate-200 hover:border-slate-200 hover:bg-white/10"
                  }`}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur">
        {loading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-200">
            Loading weather...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-200">
            <p className="font-semibold">Unable to load weather</p>
            <p>{error}</p>
          </div>
        ) : weatherDetails ? (
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-sky-300/80">Current location</p>
                    <h2 className="mt-3 text-3xl font-semibold text-white">
                      {weather.name}, {weatherDetails.country}
                    </h2>
                  </div>
                  <div className="rounded-3xl bg-slate-950/90 px-4 py-3 text-right text-slate-200">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Weather</p>
                    <p className="mt-1 text-lg font-semibold text-white capitalize">
                      {weatherDetails.description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950/80 p-5">
                    <p className="text-sm text-slate-400">Temperature</p>
                    <p className="mt-3 text-3xl font-semibold text-white">
                      {weatherDetails.tempC}°C / {weatherDetails.tempF}°F
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-5">
                    <p className="text-sm text-slate-400">Feels like</p>
                    <p className="mt-3 text-3xl font-semibold text-white">
                      {weatherDetails.feelsC}°C / {weatherDetails.feelsF}°F
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm text-slate-400">Humidity</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{weatherDetails.humidity}%</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm text-slate-400">Pressure</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{weatherDetails.pressure} hPa</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm text-slate-400">Wind speed</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{weatherDetails.wind} m/s</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm text-slate-400">Visibility</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{toKm(weatherDetails.visibility)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 text-slate-200">
              <h3 className="text-xl font-semibold text-white">Weather details</h3>
              <dl className="mt-6 space-y-4 text-sm text-slate-300">
                <div className="flex items-center justify-between gap-4 rounded-3xl bg-white/5 px-4 py-4">
                  <dt className="font-medium text-slate-200">Sunrise</dt>
                  <dd>{formatTime(weatherDetails.sunrise, weather.timezone)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-3xl bg-white/5 px-4 py-4">
                  <dt className="font-medium text-slate-200">Sunset</dt>
                  <dd>{formatTime(weatherDetails.sunset, weather.timezone)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-3xl bg-white/5 px-4 py-4">
                  <dt className="font-medium text-slate-200">Coordinates</dt>
                  <dd>
                    {weather.coord.lat.toFixed(2)}, {weather.coord.lon.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-slate-200">
            Search a location to see live weather details.
          </div>
        )}
      </section>
    </div>
  );
}
