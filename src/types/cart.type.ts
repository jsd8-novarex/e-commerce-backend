import { Types } from 'mongoose';

export interface CartItemType {
  id: Types.ObjectId;
  product_choice_id: Types.ObjectId;
  quantity: number;
}

export interface CartType {
  _id: Types.ObjectId;
  customer_id: Types.ObjectId;
  status: string;
  payment_method: string;
  payment_status: string;
  payment_timestamp: Date | null;
  total_price: number;
  create_timestamp: Date;
  last_updated_timestamp: Date;
  creator_id: Types.ObjectId;
  last_op_id: Types.ObjectId;
  tram_status: boolean;
  cart_item: CartItemType[];
}
