import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cartModel from '../../models/cartModel';

const validateCartIdMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cartId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      res.status(400).json({ success: false, message: 'Invalid cart ID' });
      return;
    }
    const cart = await cartModel.findById(cartId);

    if (!cart) {
      res.status(400).json({ success: false, message: 'Cart not found' });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

const validateCartByCustomerIdMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      res.status(400).json({ success: false, message: 'Invalid customer ID' });
      return;
    }

    const existingCart = await cartModel.findOne({
      customer_id: customerId,
      status: { $nin: ['completed', 'cancelled'] },
    });

    if (existingCart) {
      req.body.existingCart = existingCart;
    }

    next();
  } catch (error: any) {
    next(error);
  }
};

export { validateCartIdMiddleware, validateCartByCustomerIdMiddleware };
