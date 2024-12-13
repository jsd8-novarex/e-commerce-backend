import { NextFunction, Request, Response } from 'express';
import cartModel from '../../models/cartModel';
import productModel from '../../models/product/productModel';
import { CartItemType } from '../../types/cart.type';
import mongoose from 'mongoose';
import {
  AddItemToCartRepBodyType,
  PostCurrentCartRepBodyType,
  RemoveItemFromCartRepBodyType,
  updateItemQuantityRepBodyType,
} from './cartController.type';

const getCartByCustomerId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerId } = req.body;

    const isCart = await cartModel.find({ customer_id: customerId });
    res.status(200).json({ success: true, cart: isCart });
  } catch (error: any) {
    console.log(error);
    next(error);
    // res.status(500).json({ success: false, message: error.message });
  }
};

const postCurrentCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { existingCart }: PostCurrentCartRepBodyType = req.body;

    if (existingCart) {
      const productChoiceId = existingCart.cart_item.map(
        (item) => item.product_choice_id
      );

      const cartProductItems = await productModel.aggregate([
        {
          $unwind: '$product_choices',
        },
        {
          $match: { 'product_choices._id': { $in: productChoiceId } },
        },
        {
          $addFields: {
            product_choice_id: '$product_choices._id',
            color: '$product_choices.color',
            size: '$product_choices.size',
            price: '$product_choices.price',
            image_url: {
              $arrayElemAt: ['$product_choices.images.url', 0],
            },
          },
        },
        {
          $project: {
            _id: 0,
            product_name: '$name',
            product_choice_id: 1,
            color: 1,
            size: 1,
            price: 1,
            image_url: 1,
          },
        },
      ]);

      const productChoice = existingCart.cart_item.map((item: CartItemType) => {
        const productItem = cartProductItems.find(
          (enriched: any) =>
            enriched.product_choice_id.toString() ===
            item.product_choice_id.toString()
        );

        return {
          id: item.id,
          product_choice_id: item.product_choice_id,
          quantity: item.quantity,
          ...productItem,
        };
      });

      const currentCart = JSON.parse(
        JSON.stringify({
          _id: existingCart._id,
          customer_id: existingCart.customer_id,
          status: existingCart.status,
          payment_method: existingCart.payment_method,
          payment_status: existingCart.payment_status,
          payment_timestamp: existingCart.payment_timestamp,
          total_price: existingCart.total_price,
          create_timestamp: existingCart.create_timestamp,
          last_updated_timestamp: existingCart.last_updated_timestamp,
          creator_id: existingCart.creator_id,
          last_op_id: existingCart.last_op_id,
          tram_status: existingCart.tram_status,
          cart_item: productChoice,
        })
      );

      res.status(200).json({ success: true, cart: currentCart });
      return;
    }

    res.status(404).json({
      success: false,
      message: 'No cart found for the current customer',
    });
  } catch (error: any) {
    console.error('Error in postCurrentCart:', error);
    next(error);
    // res.status(500).json({ success: false, message: error.message });
  }
};

const addItemToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      customerId,
      productChoiceId,
      quantity,
      existingCart,
    }: AddItemToCartRepBodyType = req.body;

    if (!quantity) {
      res.status(400).json({
        success: false,
        message:
          'Quantity is required or invalid. Please check your cart and try again.',
      });
      return;
    }

    if (existingCart) {
      const cart = await cartModel.findById(existingCart._id);

      if (!cart) {
        res.status(404).json({ success: false, message: 'Cart not found' });
        return;
      }

      const existingCartItemIndex = cart.cart_item.findIndex(
        (item) => item.product_choice_id.toString() === productChoiceId
      );

      if (existingCartItemIndex > -1) {
        cart.cart_item[existingCartItemIndex].quantity += quantity;
      } else {
        cart.cart_item.push({
          id: new mongoose.Types.ObjectId(),
          product_choice_id: new mongoose.Types.ObjectId(productChoiceId),
          quantity,
        });
      }

      cart.status = 'active';
      cart.last_updated_timestamp = new Date();
      cart.last_op_id = new mongoose.Types.ObjectId(customerId);
      await cart.save();
      res
        .status(200)
        .json({ success: true, message: 'Item added to existing cart' });
      return;
    }

    await cartModel.create({
      customer_id: customerId,
      status: 'pending',
      payment_method: 'none',
      payment_status: 'not_paid',
      cart_item: [
        {
          id: new mongoose.Types.ObjectId(),
          product_choice_id: new mongoose.Types.ObjectId(productChoiceId),
          quantity,
        },
      ],
      creator_id: customerId,
      last_op_id: customerId,
    });

    res.status(201).json({
      success: true,
      message: 'Cart created successfully. Please fetch the updated cart.',
    });
  } catch (error: any) {
    console.log(error);
    next(error);
    // res.status(500).json({ success: false, message: error.message });
  }
};

const updateItemQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      customerId,
      productChoiceId,
      quantity,
      existingCart,
    }: updateItemQuantityRepBodyType = req.body;
    
    if (!quantity) {
      res.status(400).json({
        success: false,
        message:
          'Quantity is required or invalid. Please check your cart and try again.',
      });
      return;
    }

    if (existingCart) {
      const cart = await cartModel.findById(existingCart._id);

      if (!cart) {
        res.status(404).json({ success: false, message: 'Cart not found' });
        return;
      }

      const index = cart.cart_item.findIndex(
        (item) => item.product_choice_id.toString() === productChoiceId
      );

      if (index === -1) {
        res.status(404).json({ success: false, message: 'Cart not found' });
        return;
      }

      if (quantity > 0) {
        cart.cart_item[index].quantity = quantity;
      } else {
        res.status(400).json({
          success: false,
          message: 'Quantity must be greater than 0',
        });

        return;
      }

      cart.last_updated_timestamp = new Date();
      cart.last_op_id = new mongoose.Types.ObjectId(customerId);
      await cart.save();

      res
        .status(200)
        .json({ success: true, message: 'Quantity updated successfully' });

      return;
    }
    res.status(404).json({ success: false, message: 'Cart not found' });
  } catch (error: any) {
    console.log(error);
    next(error);
    // res.status(500).json({ success: false, message: error.message });
  }
};

const removeItemFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      customerId,
      productChoiceId,
      existingCart,
    }: RemoveItemFromCartRepBodyType = req.body;

    if (existingCart) {
      const cart = await cartModel.findById(existingCart._id);

      if (!cart) {
        res.status(404).json({ success: false, message: 'Cart not found' });
        return;
      }

      const index = cart.cart_item.findIndex(
        (item) => item.product_choice_id.toString() === productChoiceId
      );

      if (index === -1) {
        res
          .status(404)
          .json({ success: false, message: 'Item not found in cart' });
        return;
      }

      cart.cart_item.splice(index, 1);
      cart.last_updated_timestamp = new Date();
      cart.last_op_id = new mongoose.Types.ObjectId(customerId);
      await cart.save();

      res
        .status(200)
        .json({ success: true, message: 'Item removed from cart' });
      return;
    }

    res.status(404).json({ success: false, message: 'Cart not found' });
  } catch (error: any) {
    console.log(error);
    next(error);
    // res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getCartByCustomerId,
  postCurrentCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
};
