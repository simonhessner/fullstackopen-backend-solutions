const express = require("express")
const morgan = require('morgan')
const cors = require("cors")

morgan.token('data', (req, _) => {
    if(req.method === "POST") {
        return JSON.stringify(req.body)
    }
    return null
})

app = express()
app.use(cors())
app.use(express.json())
app.use(morgan(":method :url :status - :response-time ms :data"))
app.use(express.static('build'))


let persons = [
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

app.get('/info', (_, response) => {
    const number = persons.length

    const msg = `Phonebook has info for ${number} people. <br /> <br />${(new Date())}`
    response.send(msg)
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

const generateId = () => {
    return Math.floor(Math.random() * 1000000)
}

app.post('/api/persons', (request, response) => {
    if(request.get('Content-Type') !== 'application/json') {
        return response.status(400).end()
    }

    const data = request.body

    if(!data.name) {
        return response.status(400).json({
            'error': 'Name is missing'
        })
    }

    if(!data.phone) {
        return response.status(400).json({
            'error': 'Phone is missing'
        })
    }

    if(persons.find(p => p.name === data.name)) {
        return response.status(400).json({
            'error': 'Person already exists'
        })
    }

    const person = {
        name: data.name,
        phone: data.phone,
        id: generateId()
    }

    persons = persons.concat(person)

    response.status(200).json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    // No check if ID exists. If it has already been deleted, we consider the operation successful.
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

const unknownEndpoint = (_, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))