import { useState } from 'react'

export default function SearchBar({ onSearch, disabled }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault() // page reload na ho
    const city = text.trim()
    if (city) onSearch(city)
  }

  return (
    <form className="search" onSubmit={handleSubmit}>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Search city, e.g. Mumbai" aria-label="City name" />
      <button type="submit" disabled={disabled || !text.trim()}>Search</button>
    </form>
  )
}
