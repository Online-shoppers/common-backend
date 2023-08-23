import { ArrayCollection, Collection, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { CartProductDto } from 'app/cart-product/dto/cart-product.dto';
import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';

import { ProductEntity } from 'shared/entities/product.entity';

import { CartDto } from './dto/cart.dto';
import { CartRepo } from './repo/cart.repo';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepo: CartRepo,
    @InjectRepository(ProductEntity)
    private readonly productsRepo: EntityRepository<ProductEntity>,
    @InjectRepository(CartProductEntity)
    private readonly cartProductsRepo: EntityRepository<CartProductEntity>,
  ) {}

  async getUsersCart(userId: string) {
    const cart = await this.cartRepo.findOne({ user: { id: userId } });

    await cart.products.init();

    return CartDto.fromEntity(cart);
  }

  getCartProducts(cartId: string) {
    return this.cartProductsRepo.find({ cart: { id: cartId } });
  }

  async addProductToCart(userId: string, productId: string) {
    const em = this.cartRepo.getEntityManager();

    const [cart, product] = await Promise.all([
      this.cartRepo.findOne({ user: { id: userId } }),
      this.productsRepo.findOne({ id: productId }),
    ]);

    await cart.products.init();

    console.log(
      cart.products,
      CartProductDto.fromEntities(cart.products),
      'add to cart',
    );

    const existingCartProduct = await this.cartProductsRepo.findOne({
      cart: { id: cart.id },
      product: { id: product.id },
    });

    if (existingCartProduct) {
      existingCartProduct.quantity += 1;
      await em.persistAndFlush(existingCartProduct);
    } else {
      const cartProduct = this.cartProductsRepo.create({
        name: product.name,
        category: product.category,
        quantity: 1,
        description: product.description,
        cart: { id: cart.id },
        product: { id: productId },
      });

      await em.persistAndFlush(cartProduct);

      // cart.products = cart.products.map(item =>
      //   item.id === cartProduct.id ? cartProduct : item,
      // );
      //
      // wrap(cart).assign(
      //   {
      //     products: cart.products.map(item =>
      //       item.id === cartProduct.id ? cartProduct : item,
      //     ),
      //   },
      //   { mergeObjects: true },
      // );
    }

    // const newCart = wrap(cart).assign(
    //   { products: [...cart.products, product] },
    //   { mergeObjects: true },
    // );

    // await em.persistAndFlush(newCart);

    return CartDto.fromEntity(cart);
  }

  async clearCart(userId: string) {
    const cart = await this.cartRepo.findOne({ user: { id: userId } });
    const em = this.cartRepo.getEntityManager();

    await cart.products.init();

    this.cartProductsRepo.nativeDelete({ cart: { id: cart.id } });

    const cleared = wrap(cart).assign({ products: [] }, { mergeObjects: true });
    await em.persistAndFlush(cleared);

    return CartDto.fromEntity(cart);
  }
}
