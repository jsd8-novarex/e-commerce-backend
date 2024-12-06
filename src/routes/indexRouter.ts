import express, { Request, Response } from 'express';
import productRouter from './productRouter';
import customerRouter from './customerRouter';
import authRoutes from './authRoutes';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).send({ message: 'Hello, world! This is API' });
});

router.use('/customer', customerRouter);
router.use('/product', productRouter);
router.use('/api/auth', authRoutes);
export default router;
