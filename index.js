const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

//Environment vars
const PORT = process.env

//Middle ware
//cors allowed urls
app.use(
    cors({
        origin: '*',
    })
)
//Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



// CONTROLLERS
// Dishes 
app.use('/dishes-db', require('./controllers/dishes'))

// Portfolio Mail
app.use('/contact', require('./controllers/portfolio_contact'))

app.get('*', (req,res) =>{
    res.status(404).send('PAGE NOT FOUND')
})

app.listen(PORT, () => console.log(`listening to port: ${PORT}`))
