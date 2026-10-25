import { useEffect, useRef, useState } from 'react'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import { getWeather } from './api/weather'

export default function App() {
  const [weather, setWeather] = useState(null) // API se aaya data
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const controller = useRef(null) // purani request cancel karne ke liye

  const search = async (city) => {
    controller.current?.abort()
    const c = new AbortController()
    controller.current = c
    setLoading(true)
    setError('')
    try {
      setWeather(await getWeather(city, c.signal))
    } catch (err) {
      if (err.name === 'AbortError') return
      setWeather(null)
      setError(err instanceof TypeError ? 'Network problem. Check your internet connection.' : err.message)
    } finally {
      if (controller.current === c) setLoading(false)
    }
  }

  // Page khulte hi ek default city dikhao
  useEffect(() => {
    search('Delhi')
    return () => controller.current?.abort()
  }, [])

  return (
    <main className="app">
      <h1>Weather App</h1>
      <SearchBar onSearch={search} disabled={loading} />
      {loading && <p className="status">Loading weather…</p>}
      {error && <p className="status error" role="alert">{error}</p>}
      {weather && !loading && <WeatherCard data={weather} />}
    </main>
  )
}
