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


const {Schema, model} = mongoose

const houseSchema =new Schema({
    name: String,
    city: String,
    address: String,
    bedrooms: Number,
    bathrooms: Number,
    image: String

}) 

const House = model("House", houseSchema)




app.use(morgan('dev'))
app.use(express.urlencoded({extended: true})) // parse urlencoded request bodies
app.use(express.static("public")) // serve files from public statically
app.use(methodOverride("_method")) // override for put and delete requests from forms





app.get('/', (req, res) => {
    res.send('<h1>Server is Working</h1>')
})


app.get('/house/seed', (req, res) => {

    const seedHouses = [
        { name: 'John', city: 'Orlando FL', address: '1648 Penny PLane', bedrooms: 3, bathrooms: 2, image: '/images/7145183_0_26EYaa_p.jpeg'},
        { name: 'Greg', city: 'Juliete NC', address: '46 Ferry Creek', bedrooms: 5, bathrooms: 3},
        { name: 'Craig', city: 'Springfield MA', address: '173 Harolds way', bedrooms: 4, bathrooms: 2},
    ]



    House.deleteMany({}, (err, data) => {
        House.create(seedHouses, (err, fruits) => {
            
            console.log(data)
            mongoose.connection.close()
        })
    })

})



app.get('/house', (req, res) => {
    House.find({})
    .then((houses) => {
        console.log(houses)
        res.render('house/index.ejs', { houses});
    });

})



const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`listening on ${PORT}`))