// models/orderModel.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: 'Order Placed', required: true },
  paymentMethod: { type: String, default: 'Stripe', required: true },
  payment: { type: Boolean, default: false, required: true },
  date: { type: Date, default: Date.now, required: true },
});

const orderModel = mongoose.model('Order', orderSchema, 'order');
export default orderModel;
