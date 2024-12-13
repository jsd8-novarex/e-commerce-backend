import mongoose, { Schema, Document } from 'mongoose';

export interface CustomerDocument extends Document {
  name: string;
  email: string;
  password: string;
  mobile_phone?: string | null;
  date_of_birth?: Date | null;
  creator_id: mongoose.Types.ObjectId | undefined;
  last_op_id: mongoose.Types.ObjectId | undefined;
  tram_status: boolean;
  create_timestamp: Date;
  last_updated_timestamp: Date;
}

const customerSchema = new Schema<CustomerDocument>(
  {
    name: {
      type: String,
      required: true,
      default: function (this: CustomerDocument) {
        return this.email;
      },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile_phone: { type: String, default: null },
    date_of_birth: { type: Date, default: null },
    creator_id: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      default: function (this: CustomerDocument) {
        return this._id;
      },
    },
    last_op_id: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      default: function (this: CustomerDocument) {
        return this._id;
      },
    },
    tram_status: { type: Boolean, default: true },
  },
  {
    timestamps: {
      createdAt: 'create_timestamp',
      updatedAt: 'last_updated_timestamp',
    },
  }
);

const customerModel = mongoose.model<CustomerDocument>(
  'Customer',
  customerSchema,
  'customer'
);
export default customerModel;
