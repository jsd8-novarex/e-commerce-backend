import mongoose from 'mongoose';
import { productImageSchema } from './productImageSchema';

export const productChoiceSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  images: [productImageSchema],
});
