export default function About() {
  return (
    <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/40">
      <h2 className="text-3xl font-semibold text-white">About This Weather App</h2>
      <p className="mt-4 text-slate-300 leading-7">
        This app is a responsive weather dashboard built with React Router and modern web components. Search any city, see temperature in Celsius and Fahrenheit, plus humidity, pressure, wind, visibility, and sunrise/sunset times.
      </p>
      <ul className="mt-6 space-y-3 text-slate-300">
        <li>• Live weather lookup for any location.</li>
        <li>• Dynamic custom background themes.</li>
        <li>• Mobile-first responsive layout.</li>
        <li>• OpenWeatherMap API integration.</li>
      </ul>
    </div>
  );
}
