import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/phonenumbers'

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [newSearch, setNewSearch] = useState('')

  useEffect(() => {
    personService.getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
    }, [])

  const addName = e => {
    e.preventDefault()
    const nameObject = {
      name: newName,
      id: persons.length + 1,
      number: newNumber
    }

    const foundPerson = persons.find(person => person.name === nameObject.name)

    if (foundPerson) {
      if (window.confirm(`${nameObject.name} is already added to the phonebook, replace the old number with a new one?`)) {
      personService.update(foundPerson.id, nameObject)
        .then(returnedObject => {
          setPersons(persons.map(person => person.id !== foundPerson.id ? person : returnedObject))
        })
    }}
    else {
      personService.create(nameObject)
        .then(returnedObject => {
          setPersons(persons.concat(returnedObject))
        setNewName('')
        setNewNumber('')
        setNewSearch('')
    })
    }
  }

  const handleChange = setValue => e => setValue(e.target.value)

  const handleRemove = (id,name) => () => {
    if (window.confirm(`Delete ${name} ?`)) {
    personService.remove(id)
    .then(setPersons(persons.filter(person => person.name !== name)))
  }
  }

  const personsToShow = persons.filter(person =>person.name.toLowerCase().includes(newSearch))
  

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter query={newSearch} handleChange={handleChange(setNewSearch)} />

      <h3>add a new</h3>

      <PersonForm  handleAddName={addName} name={newName} number={newNumber} handleChangeName={handleChange(setNewName)} handleChangeNumber={handleChange(setNewNumber)}/>

      <h3>Numbers</h3>

      <Persons persons={personsToShow} handleDelete={handleRemove} />
    </div>
  )
}

export default App