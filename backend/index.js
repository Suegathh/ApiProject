import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
const app = express()
import authRouter from './routers/authRouter.js';
import dotenv from 'dotenv';

dotenv.config()

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