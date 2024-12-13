import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/indexRouter';
import mongodb from './config/mongodb';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

mongodb();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.VERCEL_ONE_URL,
  process.env.VERCEL_TWO_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());
// app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error 😖',
    error: err.message,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} 🐱`);
});
