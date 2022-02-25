const router = require('express').Router()

// env vars

const DB_API_KEY = process.env.DB_API_KEY
const PROJECT_ID =  process.env.PROJECT_ID
const DATABASE_NAME = process.env.DATABASE_NAME
const SENDER_ID = process.env.SENDER_ID
const APP_ID = process.env.APP_ID

// firebase
const { initializeApp } = require('firebase/app')
const { getDatabase, ref, set, get, child, update, remove } = require('firebase/database')
const { getAuth, signInWithEmailAndPassword, signOut } = require('firebase/auth')

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
const auth = getAuth(FireApp)


// Dishes DB Route

// AUTH
router.post('/auth', async (req,res)=>{
    try{
        const userCredentials = await signInWithEmailAndPassword(auth, req.body.email,req.body.password);
        if (userCredentials !== null){
            res.send(userCredentials)
        }
        
    }
    catch(err) {
        res.status(400).send(JSON.stringify(err))
    }
})

router.get('/auth', async (req,res) => {
    const response = await  signOut(auth)
    try {
        res.send("Successfully Logged out")
    } catch (err) {
        console.log(err)
    }
})
// DB Routes
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
// Adding new dish
router.post('/add-new', async (req, res) => {
    try {
        const response = await update(ref(database, `dishesList/${req.body.newIndex}`),{
            dishName: req.body.dishName,
            ingredients: req.body.ingredients
        });
        res.send('received')
    } catch (error) {
        console.error(error)
    }
})

// Deleting Dish
router.post('/delete-db', async (req, res) =>{
    try {
        const response = await remove(child(ref(database), `dishesList/${req.body.index}/`))
        res.send('Deleted')
        
    } catch (error) {
        console.error(error)
    }
})


module.exports = router