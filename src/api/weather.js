// Open-Meteo: free API, koi API key nahi chahiye.
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'

// Weather code -> text + emoji (WMO codes)
function describe(code, isDay) {
  if (code === 0) return { condition: 'Clear sky', icon: isDay ? '☀️' : '🌙' }
  if (code <= 2) return { condition: 'Partly cloudy', icon: isDay ? '⛅' : '☁️' }
  if (code === 3) return { condition: 'Overcast', icon: '☁️' }
  if (code <= 48) return { condition: 'Fog', icon: '🌫️' }
  if (code <= 57) return { condition: 'Drizzle', icon: '🌦️' }
  if (code <= 67) return { condition: 'Rain', icon: '🌧️' }
  if (code <= 77) return { condition: 'Snow', icon: '❄️' }
  if (code <= 82) return { condition: 'Rain showers', icon: '🌧️' }
  if (code <= 86) return { condition: 'Snow showers', icon: '🌨️' }
  return { condition: 'Thunderstorm', icon: '⛈️' }
}

// Step 1: city naam -> latitude/longitude. Step 2: us location ka weather.
export async function getWeather(city, signal) {
  const geoRes = await fetch(`${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`, { signal })
  if (!geoRes.ok) throw new Error('Could not search for that city.')
  const { results } = await geoRes.json()
  if (!results?.length) throw new Error(`No city found for "${city}". Check the spelling.`)

  const { name, admin1, country, latitude, longitude } = results[0]
  const params = 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day'
  const res = await fetch(`${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=${params}&timezone=auto`, { signal })
  if (!res.ok) throw new Error('Could not load weather data.')
  const { current } = await res.json()

  return {
    place: [name, admin1, country].filter(Boolean).join(', '),
    temp: Math.round(current.temperature_2m),
    feels: Math.round(current.apparent_temperature),
    humidity: current.relative_humidity_2m,
    wind: Math.round(current.wind_speed_10m),
    ...describe(current.weather_code, current.is_day),
  }
}
