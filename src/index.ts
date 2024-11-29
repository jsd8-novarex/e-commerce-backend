import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/indexRouter';
import mongodb from './config/mongodb';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

mongodb();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
// app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
