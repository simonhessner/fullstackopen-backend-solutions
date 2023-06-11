require('dotenv').config()
const express = require("express")
const morgan = require('morgan')
const cors = require("cors")
const Person = require("./models/person")

morgan.token('data', (req, _) => {
    if(req.method === "POST") {
        return JSON.stringify(req.body)
    }
    return null
})

app = express()
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(":method :url :status - :response-time ms :data"))
app.use(cors())

app.get('/info', (_, response) => {
    Person.find({}).then(persons => {
        const number = persons.length
        response.send(`Phonebook has info for ${number} people. <br /> <br />${(new Date())}`)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (_, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

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

    const person = new Person({
        name: data.name,
        phone: data.phone,
    })

    person.save()
        .then(savedPerson => {
            response.status(200).json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    const person = {
        name: body.name,
        phone: body.phone
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(_ => response.status(204).end())
        .catch(error => next(error))
})

const unknownEndpoint = (_, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformed ID.'
        })
    }

    next(error)
}
app.use(errorHandler)

PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))