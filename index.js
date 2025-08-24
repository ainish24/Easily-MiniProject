import express from 'express'
import { connectDb } from './interviewQuestion/dbConfig/dbConfig.js';
import { detailsController } from './interviewQuestion/controller/detailsController.js';

const app = express();

app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Server is running!")
})

app.post('/getDetails', detailsController)

app.listen(3000,async ()=>{
    await connectDb()
    console.log("Server is up!")
})

