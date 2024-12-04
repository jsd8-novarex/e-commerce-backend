import mongoose from 'mongoose';

const productChoiceSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    default: new mongoose.Types.ObjectId(),
  },
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
  images: [
    {
      url: {
        type: String,
        required: true,
      },
      index: {
        type: Number,
        required: true,
      },
    },
  ],
});


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  product_choices: [productChoiceSchema],
  create_timestamp: {
    type: Date,
    default: Date.now,
  },
  last_updated_timestamp: {
    type: Date,
    default: Date.now,
  },
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  last_op_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  tram_status: {
    type: Boolean,
    default: true,
  },
});

const productModel = mongoose.model('product', productSchema, 'product');
export default productModel;