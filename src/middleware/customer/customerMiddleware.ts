import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import customer from '../../models/customerModel2';

const validateCustomerIdMiddleware = async (
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

    const isCustomer = await customer.findById(id);
    if (!isCustomer) {
      res.status(404).json({ success: false, message: 'Customer not found' });
      return;
    }

    next();
  } catch (error: any) {
    next(error);
  }
};

export { validateCustomerIdMiddleware };