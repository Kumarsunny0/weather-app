export default function WeatherCard({ data }) {
  return (
    <section className="card" aria-live="polite">
      <h2 className="place">{data.place}</h2>
      <div className="icon" aria-hidden="true">{data.icon}</div>
      <p className="temp">{data.temp}°C</p>
      <p className="condition">{data.condition}</p>
      <div className="stats">
        <div><span>Humidity</span><strong>{data.humidity}%</strong></div>
        <div><span>Feels like</span><strong>{data.feels}°C</strong></div>
        <div><span>Wind</span><strong>{data.wind} km/h</strong></div>
      </div>
    </section>
  )
}
