const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

//Environment vars

const PORT = process.env.PORT || 3001
const DISHES_URL = process.env.DISHES_URL
const DEV_URL =  process.env.DEV_URL




//Middle ware
//cors allowed urls
app.use(
    cors({
        origin: [DISHES_URL, DEV_URL],
    })
)
//Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



// ROUTES
// TEST ROUTE
app.get('/test-db',(req, res) =>{
    const dbRef = ref(database);
    get(child(dbRef, `/leaderBoard`)).then((snapshot) => {
        if (snapshot.exists()){
            res.send(`${JSON.stringify(snapshot)}`)
        }else{
            res.send('no data found')
        }
    }).catch(err => {
        res.send(`${err}`)
    })
})

app.post('/test-db', (req, res) => {
    const dbRef = ref(database, '/leaderBoard')
    if(Object.entries(req.body).length !== 0){
        set(dbRef, req.body)
    
        console.log(req.body)
        res.send(`successfully saved`)
    }else{
        res.send('No data received')
    }
})

// Dishes 
app.use('/dishes-db', require('./controllers/dishes'))

app.get('*', (req,res) =>{
    res.status(404).send('PAGE NOT FOUND')
})

app.listen(PORT, () => console.log(`listening to port: ${PORT}`))
