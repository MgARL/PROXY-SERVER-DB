const router = require('express').Router()

// env vars

const PORT = process.env.PORT || 3001
const DB_API_KEY = process.env.DB_API_KEY
const PROJECT_ID =  process.env.PROJECT_ID
const DATABASE_NAME = process.env.DATABASE_NAME
const SENDER_ID = process.env.SENDER_ID
const APP_ID = process.env.APP_ID

// firebase
const { initializeApp } = require('firebase/app')
const { getDatabase, ref, set, get, child, update, remove } = require('firebase/database')
const { getAuth, signInWithEmailAndPassword, signOut } = require('firebase/auth')
const { async } = require('@firebase/util')

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


// Dishes DB Route
router.post('/auth', async (req,res)=>{
    try{
        const userCredentials = await signInWithEmailAndPassword(getAuth(FireApp), req.body.email,req.body.password);
        if (userCredentials !== null){
            res.send(userCredentials)
        }
        
    }
    catch(err) {
        res.status(400).send(JSON.stringify(err))
    }
})
router.get('/get-db',(req, res) =>{
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

router.post('/delete-db', (req, res) =>{
    console.log(req.body)
})

module.exports = router