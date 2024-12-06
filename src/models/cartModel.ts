import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    product_choice_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true },
    creator_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    last_op_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  {
    _id: false,
  }
);

const cartSchema = new mongoose.Schema(
  {
    customer_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      required: true,
      default: 'pending',
      enum: [
        'pending',
        'active',
        'ready',
        'processing',
        'completed',
        'cancelled',
      ],
    },
    payment_method: {
      type: String,
      default: 'none',
      enum: ['credit_card', 'none'],
    },
    payment_status: {
      type: String,
      required: true,
      default: 'not_paid',
      enum: ['not_paid', 'in_progress', 'paid', 'failed'],
    },
    payment_timestamp: { type: Date, default: null },
    cart_item: [cartItemSchema],
    create_timestamp: { type: Date, default: Date.now },
    last_updated_timestamp: { type: Date, default: Date.now },
    creator_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    last_op_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    tram_status: { type: Boolean, default: true },
  },
  {
    versionKey: false,
  }
);

const cartModel = mongoose.model('cart', cartSchema, 'cart');
export default cartModel;
