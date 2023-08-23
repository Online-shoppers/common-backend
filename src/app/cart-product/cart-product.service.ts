import { Injectable } from '@nestjs/common';

import { CartProductRepo } from './repo/cart-product.repo';

@Injectable()
export class CartProductService {
  constructor(private readonly cartProductRepo: CartProductRepo) {}

  getCartProducts(cartId: string) {
    return this.cartProductRepo.find({ cart: { id: cartId } });
  }
}
