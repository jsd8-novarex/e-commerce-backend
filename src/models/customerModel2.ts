import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile_phone: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  create_timestamp: { type: Date, default: Date.now },
  last_updated_timestamp: { type: Date, default: Date.now },
  creator_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  last_op_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  tram_status: { type: Boolean, default: true },
});

const customer = mongoose.model('customer', customerSchema, 'customer');
export default customer;
