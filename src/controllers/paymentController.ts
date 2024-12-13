// Required imports
import Stripe from 'stripe';
import cartModel from '../models/cartModel';
import orderModel from '../models/orderModel';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import customerAddressModel from '../models/customerAddress';
import productModel from '../models/product/productModel';
dotenv.config();
// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const currency = 'thb';
const deliveryCharge = 0;

// Place order using Stripe
const placeOrderStripe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerId } = req.body;

    // Fetch customer address
    const customerAddress = await customerAddressModel.findOne({
      customer_id: new mongoose.Types.ObjectId(customerId),
    });

    if (!customerAddress) {
      res
        .status(404)
        .json({ success: false, message: 'Customer address not found' });
      return;
    }

    const address = {
      street: customerAddress.address,
      subdistrict: customerAddress.subdistrict,
      district: customerAddress.district,
      province: customerAddress.province,
      postalCode: customerAddress.postal_code,
    };

    // Fetch cart and validate
    const cart = await cartModel.findOne({
      customer_id: new mongoose.Types.ObjectId(customerId),
    });

    if (!cart || cart.cart_item.length === 0) {
      res
        .status(400)
        .json({ success: false, message: 'Cart is empty or not found' });
      return;
    }

    // Fetch product details for the cart items
    const productChoiceIds = cart.cart_item.map(
      (item) => item.product_choice_id
    );
    const products = await productModel.aggregate([
      { $unwind: '$product_choices' },
      { $match: { 'product_choices._id': { $in: productChoiceIds } } },
      {
        $addFields: {
          product_choice_id: '$product_choices._id',
          name: '$name',
        },
      },
      {
        $project: {
          product_choice_id: 1,
          name: 1,
          price: '$product_choices.price',
        },
      },
    ]);

    const productMap = products.reduce(
      (acc, product) => {
        acc[product.product_choice_id.toString()] = product;
        return acc;
      },
      {} as Record<string, any>
    );

    // Create line items for Stripe
    const line_items = cart.cart_item.map((item) => {
      const product = productMap[item.product_choice_id.toString()];
      if (!product) {
        throw new Error(`Product with ID ${item.product_choice_id} not found.`);
      }
      return {
        price_data: {
          currency,
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
        quantity: item.quantity,
      };
    });

    // Add delivery charge
    line_items.push({
      price_data: {
        currency,
        product_data: { name: 'Delivery Charge' },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    // Create order
    const orderData = {
      userId: new mongoose.Types.ObjectId(customerId),
      items: cart.cart_item,
      amount: cart.total_price + deliveryCharge,
      address,
      paymentMethod: 'Stripe',
      payment: false,
      status: 'Order Placed',
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      success_url: `${req.headers.origin || 'http://localhost:4000'}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${req.headers.origin || 'http://localhost:4000'}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
    });

    res.status(200).json({ success: true, sessionUrl: session.url });
  } catch (error: any) {
    console.error('Error placing order:', error);
    next(error);
  }
};

// Verify Stripe payment
const verifyStripe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId, success } = req.body; // เพิ่ม `customerId` มาด้วยสำหรับลบตะกร้า

    // ตรวจสอบว่าการชำระเงินสำเร็จหรือไม่
    if (success === 'true') {
      // อัปเดตสถานะการชำระเงินในคำสั่งซื้อ
      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        { payment: true },
        { new: true } // Return the updated document
      );

      if (!updatedOrder) {
        res
          .status(404)
          .json({ success: false, message: 'Order not found for update' });
        return;
      }

      //   // ลบตะกร้าสินค้าหลังการชำระเงินสำเร็จ
      //   await cartModel.findOneAndDelete({ customer_id: customerId });

      //   res.status(200).json({
      //     success: true,
      //     message: 'Payment verified and order updated',
      //     order: updatedOrder,
      //   });
      // } else {
      //   // หากการชำระเงินล้มเหลว ให้ลบคำสั่งซื้อ
      //   await orderModel.findByIdAndDelete(orderId);

      res.status(400).json({
        success: false,
        message: 'Payment failed. Order cancelled.',
      });
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    next(error);
  }
};

// Update cart schema if needed to reflect order-specific logic
// e.g., resetting the cart or handling "checked-out" status

export { placeOrderStripe, verifyStripe };
