import { CartType } from '../../types/cart.type';

export interface PostCurrentCartRepBodyType {
  existingCart?: CartType;
}

export interface AddItemToCartRepBodyType {
  customerId: string;
  productChoiceId: string;
  quantity: number;
  existingCart?: CartType;
}

export interface updateItemQuantityRepBodyType
  extends AddItemToCartRepBodyType {}

export interface RemoveItemFromCartRepBodyType {
  customerId: string;
  productChoiceId: string;
  existingCart?: CartType;
}
