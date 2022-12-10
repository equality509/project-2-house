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




//home page
app.get('/', (req, res) => {
    res.send('<h1>Server is Working</h1>')
})

// seed route
app.get('/house/seed', (req, res) => {

    const seedHouses = [
        { name: 'John', city: 'Orlando FL', address: '1648 Penny PLane', bedrooms: 3, bathrooms: 2, image: '/images/7145183_0_26EYaa_p.jpeg'},
        { name: 'Greg', city: 'Juliete NC', address: '46 Ferry Creek', bedrooms: 5, bathrooms: 3, image: '/images/im-463852.jpeg'},
        { name: 'Craig', city: 'Springfield MA', address: '173 Harolds way', bedrooms: 4, bathrooms: 2, image: '/images/7145183_0_26EYaa_p.jpeg'},
    ]



    House.deleteMany({}, (err, data) => {
        House.create(seedHouses, (err, fruits) => {
            
            console.log(data)
            mongoose.connection.close()
        })
    })

})


//index page
app.get('/house', (req, res) => {
    House.find({})
    .then((houses) => {
        console.log(houses)
        res.render('house/index.ejs', { houses});
    });

})
//new route
app.get('/house/new', (req, res) => {
    res.render('house/new.ejs')
})
//create route
app.post('/house', (req, res) => {
    House.create(req.body,(err, houses) => {
        res.redirect('/house')
    })
})

//get edit page
app.get('/house/:id/edit', (req, res) => {
    House.findById(req.params.id, (err, houses) => {
        res.render('house/edit.ejs', {house: houses})
    })
})

app.put('/house/:id', (req, res) => {
    House.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, house) => {
        res.redirect(`/house/${req.params.id}`)
        console.log(house)
    })
})





//show page
app.get('/house/:id',(req, res) => {
    House.findById(req.params.id)
    .then((houses) => {
        res.render('house/show.ejs', {houses})
    })
})

app.delete('/house/:id', async (req, res) => {

    const deletedHouse = await House.findByIdAndDelete(req.params.id)

    if(deletedHouse){
        res.redirect('/house/')
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`listening on ${PORT}`))