import express from 'express';
import mongoose, { mongo } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import studentRoutes from './routes/studentRoutes.js'
import {startCronJob} from './utils/cron.js' 
import cronRoutes from './routes/cronRoutes.js'


dotenv.config();
const app=express();

app.use(cors());
app.use(express.json());
app.use('/api/students',studentRoutes);
app.use('/api/cron',cronRoutes);

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    app.listen(5001,()=> {
        console.log('Server running on port 5000');
        startCronJob();
    })
})
.catch((err)=> console.log(err));