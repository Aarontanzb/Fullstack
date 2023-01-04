import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ query, handleChange }) => 
    <p>
        find countries <input value={query} onChange={handleChange} />
    </p>

const Country = ({ country }) => <li>{country.name} <button>show</button></li>

const Countries = ({ countries }) =>
    <ul>
        {countries.map(country => <Country key={country.name} country={country} />)}
    </ul>

const CountryInfo = ({ country }) => (
    <>
      <h1>{country.name}</h1>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>))}
      </ul>
      <img
        src={country.flags.png}
        alt={`${country.name} flag`}
      />
    </>
)

const App = () => {
  const [countries, setCountries] = useState([])
  const [newSearch, setNewSearch] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => 
        setCountries(response.data.map(({ name, capital, area, languages, flags }) => ({
          name: name.common,
          capital,
          area,
          languages,
          flags,
        })))
      )
    }, [])

  const handleChange = setValue => e => setValue(e.target.value)

  const countriesToShow = countries.filter(country => country.name.toLowerCase().includes(newSearch.toLowerCase()))

  return (
    <div>
      <Filter query={newSearch} handleChange={handleChange(setNewSearch)} />

      {(countriesToShow.length > 10) && (<div>Too many matches, specify another filter</div>)}
      {(countriesToShow.length <= 10) && (countriesToShow.length > 1) && (<Countries countries={countriesToShow} />)}
      {(countriesToShow.length === 1) && (<CountryInfo country={countriesToShow[0]} />)}
    </div>
  )
}

export default App