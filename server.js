require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const mongoose = require('mongoose')

const app = express()

mongoose.connect(process.env.DATABASE_URL)

mongoose.connection
.on('open', () => console.log('Connection to Mongo'))
.on('close', () => console.log('Disconnected to Mongo'))
.on('error', (error) => console.log(error))

app.use(morgan('dev'))
app.use(express.urlencoded({extended: true})) // parse urlencoded request bodies
app.use(express.static("public")) // serve files from public statically
app.use(methodOverride("_method")) // override for put and delete requests from forms

app.get('/', (req, res) => {
    res.send('<h1>Server is Working</h1>')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`listening on ${PORT}`))