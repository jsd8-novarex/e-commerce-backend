import express from 'express';
import {
  getCartByCustomerId,
  postCurrentCart,
} from '../controllers/cartController';
import { validateCustomerIdMiddleware } from '../middleware/customer/customerMiddleware';
import { validateCartMiddleware } from '../middleware/cart/cartMiddleware';

const cartRouter = express.Router();

cartRouter.get('/', validateCustomerIdMiddleware, getCartByCustomerId);
cartRouter.post(
  '/',
  validateCustomerIdMiddleware,
  validateCartMiddleware,
  postCurrentCart
);

export default cartRouter;
