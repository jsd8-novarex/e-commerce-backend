import { Types } from "mongoose";

export interface ProductImageType {
  url: string;
  index: number;
}

export interface ProductChoiceType {
  _id: Types.ObjectId;
  color: string;
  size: string;
  price: number;
  sku: string;
  quantity: number;
  images: ProductImageType[];
}

export interface ProductType {
  _id: Types.ObjectId;
  name: string;
  brand: string;
  category: string;
  gender: string;
  description: string;
  product_choices: ProductChoiceType[];
  create_timestamp: Date;
  last_updated_timestamp: Date;
  creator_id: Types.ObjectId;
  last_op_id: Types.ObjectId;
  tram_status: boolean;
}