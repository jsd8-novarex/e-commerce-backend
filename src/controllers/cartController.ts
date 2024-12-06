import { Request, Response } from 'express';
import cartModel from '../models/cartModel';

const getCartByCustomerId = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    const isCart = await cartModel.find({ customer_id: id });
    res.status(200).json({ success: true, cart: isCart });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const postCurrentCart = async (req: Request, res: Response) => {
  try {
    const { id, existingCart } = req.body;

    if (existingCart) {
      res.status(200).json({ success: true, cart: existingCart });
      return;
    }

    const newCart = await cartModel.create({
      customer_id: id,
      status: 'pending',
      payment_method: 'none',
      payment_status: 'not_paid',
      cart_item: [],
      creator_id: id,
      last_op_id: id,
    });

    res.status(201).json({ success: true, cart: newCart });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getCartByCustomerId, postCurrentCart };
