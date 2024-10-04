const Person = ({ person, onDelete }) => {
  return (
    <div>
      {person.name} {person.number}
      <button onClick={() => onDelete(person.id)}>delete</button>
    </div>
  )
}

const Persons = ({ persons, onDelete }) => {
  return (
    <div>
      {persons.map(person => 
        <Person key={person.id} person={person} onDelete={onDelete} />
      )}
    </div>
  )
}

export default Persons;