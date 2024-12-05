const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const app = express()
const authRouter = require('./routers/authRouter')

require('dotenv').config()

app.use(cors())
app.use(helmet())
app.use(cookieParser())
app.use( express.json())
app.use(express.urlencoded({extended: true}))

mongoose
.connect(process.env.MONGO_URL)
.then(() => {
    console.log('database connected')
})
.catch((err) => {
    console.log(err)
})

app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
    res.json({message: 'hello'})
})

app.listen(process.env.PORT,() => {
    console.log('listening')
})