import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cartModel from '../../models/cartModel';

const validateCartMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid customer ID' });
      return;
    }

    const existingCart = await cartModel.findOne({
      customer_id: id,
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

export { validateCartMiddleware };
