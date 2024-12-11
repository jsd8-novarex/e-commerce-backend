import mongoose, { Schema, Document } from 'mongoose';

// Interface สำหรับ CustomerAddress Document
export interface CustomerAddressDocument extends Document {
  customer_id: mongoose.Types.ObjectId;
  postal_code: string | null;
  province: string | null;
  district: string | null;
  subdistrict: string | null;
  address: string | null;
  creator_id: mongoose.Types.ObjectId;
  last_op_id: mongoose.Types.ObjectId;
  tram_status: boolean;
  create_timestamp: Date;
  last_update_timestamp: Date;
}

// Schema ของ CustomerAddress
const customerAddressSchema = new Schema<CustomerAddressDocument>(
  {
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    postal_code: { type: String, default: null },
    province: { type: String, default: null },
    district: { type: String, default: null },
    subdistrict: { type: String, default: null },
    address: { type: String, default: null },
    creator_id: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    last_op_id: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    tram_status: { type: Boolean, default: true },
  },
  {
    timestamps: {
      createdAt: 'create_timestamp',
      updatedAt: 'last_update_timestamp',
    },
  }
);

// Model ของ CustomerAddress
const customerAddressModel = mongoose.model<CustomerAddressDocument>(
  'CustomerAddress',
  customerAddressSchema,
  'customeraddress'
);

export default customerAddressModel;
