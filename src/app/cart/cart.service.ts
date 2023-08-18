import { wrap } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { CartProductRepo } from 'app/cart-product/repo/cart-product.repo';

import { CartRepo } from './repo/cart.repo';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepo: CartRepo,
    private readonly cartProductsRepo: CartProductRepo,
  ) {}

  getUsersCart(userId: string) {
    return this.cartRepo.findOne({ user: { id: userId } });
  }

  getCartProducts(cartId: string) {
    return this.cartProductsRepo.find({ cart: { id: cartId } });
  }

  async addProductToCart(userId: string, productId: string) {
    const [cart, product] = await Promise.all([
      this.getUsersCart(userId),
      this.cartProductsRepo.findOne({ id: productId }),
    ]);

    const em = this.cartRepo.getEntityManager();

    const newCart = wrap(cart).assign(
      { products: [...cart.products, product] },
      { mergeObjects: true },
    );

    await em.persistAndFlush(newCart);

    return newCart;
  }

  async clearCart(userId: string) {
    const cart = await this.getUsersCart(userId);
    const em = this.cartRepo.getEntityManager();

    const cleared = wrap(cart).assign({ products: [] });

    await em.persistAndFlush(cleared);

    return cleared;
  }
}
