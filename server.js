import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import Routes from './routes/route.js';
import connectDB from './db/db.js';
import DefaultData from './default.js';

dotenv.config();
const app = express();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

connectDB(username,password);

const PORT = 8000;

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));

DefaultData();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', Routes);

