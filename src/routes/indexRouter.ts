import express, { Request, Response } from 'express';
import productRouter from './productRouter';
import customerRouter from './customerRouter';
import cartRouter from './cartRouter';
import authRoutes from './authRoutes';
import customerAddressRouter from './customerAddressRouter';
import paymentRouter from './paymentRoutes';
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).send({ message: 'Hello, world! This is API 🐳' });
});

router.use('/customer', customerRouter);
router.use('/product', productRouter);
router.use('/cart', cartRouter);
router.use('/auth', authRoutes);
router.use('/customeraddress', customerAddressRouter);
router.use('/payment', paymentRouter);
export default router;
