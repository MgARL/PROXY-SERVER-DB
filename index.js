const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const { initializeApp } = require('firebase/app')
const { getDatabase, ref, set, get, child } = require('firebase/database')
require('dotenv').config()

//Environment vars

const PORT = process.env.PORT || 3001
const DB_API_KEY = process.env.DB_API_KEY
const PROJECT_ID =  process.env.PROJECT_ID
const DATABASE_NAME = process.env.DATABASE_NAME
const SENDER_ID = process.env.SENDER_ID
const APP_ID = process.env.APP_ID
const JETPACK_URL = process.env.JETPACK_URL
const DISHES_URL = process.env.DISHES_URL




//Middle ware
//cors allowed urls
app.use(
    cors({
        origin: [JETPACK_URL, DISHES_URL],
    })
)
//Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Initializing Firebase

const firebaseConfig = {
    apiKey: DB_API_KEY,
    authDomain: `${PROJECT_ID}.firebaseapp.com`,
    // The value of `databaseURL` depends on the location of the database
    databaseURL: `https://${DATABASE_NAME}.firebaseio.com`,
    projectId: PROJECT_ID,
    storageBucket: `${PROJECT_ID}.appspot.com`,
    messagingSenderId: SENDER_ID,
    appId: APP_ID,
}

const FireApp = initializeApp(firebaseConfig);
const database = getDatabase(FireApp);


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

// Dishes DB Route
app.get('/dishes-db',(req, res) =>{
    const dbRef = ref(database);
    get(child(dbRef, `/dishesList`)).then((snapshot) => {
        if (snapshot.exists()){
            res.send(`${JSON.stringify(snapshot)}`)
        }else{
            res.send('no data found')
        }
    }).catch(err => {
        res.send(`${err}`)
    })
})

// JETPACK EVADER ROUTE
app.get('/jetpack-scores',(req, res) =>{
    const dbRef = ref(database);
    get(child(dbRef, `/jetpack_score/leaderBoard`)).then((snapshot) => {
        if (snapshot.exists()){
            res.send(`${JSON.stringify(snapshot)}`)
        }else{
            res.send('no data found')
        }
    }).catch(err => {
        res.send(`${err}`)
    })
})

app.post('/jetpack-scores', (req, res) => {
    const dbRef = ref(database, '/jetpack_score/leaderBoard')
    if(Object.entries(req.body).length !== 0){
        set(dbRef, req.body)
    
        console.log(req.body)
        res.send(`successfully saved`)
    }else{
        res.send('No data received')
    }
})

app.get('*', (req,res) =>{
    res.status(404).send('PAGE NOT FOUND')
})

app.listen(PORT, () => console.log(`listening to port: ${PORT}`))
