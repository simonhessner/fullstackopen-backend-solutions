const express = require("express")
app = express()
app.use(express.json())

persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (_, response) => {
    response.send("<h1>Phonebook</h1>")
})

app.get('/api/persons', (_, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    
    const person = persons.find(p => p.id === id)
    if(!person) {
        response.status(404).end()
        return
    }

    response.json(person)
})

app.get('/info', (_, response) => {
    const number = persons.length

    const msg = `Phonebook has info for ${number} people. <br /> <br />${(new Date())}`
    response.send(msg)
})

PORT = 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))