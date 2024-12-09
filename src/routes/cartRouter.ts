import express from 'express';
import {
  addItemToCart,
  getCartByCustomerId,
  postCurrentCart,
  removeItemFromCart,
  updateItemQuantity,
} from '../controllers/cart/cartController';
import { validateCustomerIdMiddleware } from '../middlewares/customer/customerMiddleware';
import { validateCartByCustomerIdMiddleware } from '../middlewares/cart/cartMiddleware';
import { validateProductChoiceIdMiddleware } from '../middlewares/product/productMiddleware';

const cartRouter = express.Router();

cartRouter.get('/', validateCustomerIdMiddleware, getCartByCustomerId);

cartRouter.post(
  '/',
  validateCustomerIdMiddleware,
  validateCartByCustomerIdMiddleware,
  postCurrentCart
);

cartRouter.post(
  '/add',
  validateProductChoiceIdMiddleware,
  validateCartByCustomerIdMiddleware,
  addItemToCart
);

cartRouter.post(
  '/quantity',
  validateProductChoiceIdMiddleware,
  validateCartByCustomerIdMiddleware,
  updateItemQuantity
);

cartRouter.post(
  '/delete',
  validateProductChoiceIdMiddleware,
  validateCartByCustomerIdMiddleware,
  removeItemFromCart
);

export default cartRouter;
