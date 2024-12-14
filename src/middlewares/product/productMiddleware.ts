import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import productModel from '../../models/product/productModel';

const validateProductIdMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({ success: false, message: 'Invalid product ID' });
      return;
    }

    const isProduct = await productModel.findById(productId);
    if (!isProduct) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

const validateProductChoiceIdMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productChoiceId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productChoiceId)) {
      res
        .status(400)
        .json({ success: false, message: 'Invalid productChoice ID' });
      return;
    }

    const isProduct = await productModel.findOne({
      'product_choices._id': productChoiceId,
    });

    if (!isProduct) {
      res
        .status(404)
        .json({ success: false, message: 'Product Choice not found' });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export { validateProductIdMiddleware, validateProductChoiceIdMiddleware };
