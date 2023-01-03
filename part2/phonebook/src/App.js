import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [newSearch, setNewSearch] = useState('')

  const addName = e => {
    e.preventDefault()
    const nameObject = {
      name: newName,
      id: persons.length + 1,
      number: newNumber
    }
    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
    }
    else {
      setPersons(persons.concat(nameObject))
      setNewName('')
      setNewNumber('')
      setNewSearch('')
    }
  }

  const handleChange = setValue => e => setValue(e.target.value)

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter query={newSearch} handleChange={handleChange(setNewSearch)} />

      <h3>add a new</h3>

      <PersonForm  handleAddName={addName} name={newName} number={newNumber} handleChangeName={handleChange(setNewName)} handleChangeNumber={handleChange(setNewNumber)}/>

      <h3>Numbers</h3>

      <Persons persons={personsToShow} />
    </div>
  )
}

export default App