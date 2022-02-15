const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const { initializeApp } = require('firebase/app')
const { getDatabase, ref, set, get, child } = require('firebase/database')
require('dotenv').config()

//Environment vars

const PORT = process.env.PORT
const DB_API_KEY = process.env.DB_API_KEY
const PROJECT_ID =  process.env.PROJECT_ID
const DATABASE_NAME = process.env.DATABASE_NAME
const SENDER_ID = process.env.SENDER_ID
const APP_ID = process.env.APP_ID





//cors allowed urls
app.use(
    cors({
        origin: '*',
    })
)
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
app.get('/get-test-db',(req, res) =>{
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

app.get('/get-dishes-db',(req, res) =>{
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

app.get('/get-jetpack-scores',(req, res) =>{
    const dbRef = ref(database);
    get(child(dbRef, `/jetpack_score`)).then((snapshot) => {
        if (snapshot.exists()){
            res.send(`${JSON.stringify(snapshot)}`)
        }else{
            res.send('no data found')
        }
    }).catch(err => {
        res.send(`${err}`)
    })
})

app.get('*', (req,res) =>{
    res.status(404).send('PAGE NOT FOUND')
})

app.listen(PORT || 3001, () => console.log(`listening to port: ${PORT||3001}`))
