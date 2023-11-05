import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors'
import Path from 'path'

import indexRoute from './src/routes/index'

dotenv.config();
//log
const app: Express = express();
const port = process.env.PORT || 7000;



app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(Path.join(__dirname, 'public')))

app.use('/api', indexRoute)
// app.use(not found)
// app.use(error handle)

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});