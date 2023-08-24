import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';

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
    const cart = await this.cartRepo.findOne(
      { user: { id: userId } },
      { populate: true },
    );

    return CartDto.fromEntity(cart);
  }

  async getUserCartProducts(userId: string) {
    const entities = await this.cartProductsRepo.find({
      cart: { user: { id: userId } },
    });
    return CartProductDto.fromEntities(entities);
  }

  async addProductToCart(userId: string, productId: string, quantity: number) {
    const em = this.cartRepo.getEntityManager();

    const [cart, product] = await Promise.all([
      this.cartRepo.findOne({ user: { id: userId } }, { populate: true }),
      this.productsRepo.findOne({ id: productId }),
    ]);

    const cartProduct = await this.cartProductsRepo.findOne({
      cart: { id: cart.id },
      product: { id: product.id },
    });

    if (product.quantity < (cartProduct?.quantity || 0) + quantity) {
      throw new NotAcceptableException('Not enough in stock');
    }

    const now = new Date();

    if (cartProduct) {
      cartProduct.quantity += quantity;
      cart.updated = now;

      await em.persistAndFlush(cartProduct);
      await em.persistAndFlush(cart);
    } else {
      const cartProduct = this.cartProductsRepo.create({
        name: product.name,
        category: product.category,
        quantity,
        description: product.description,
        cart: { id: cart.id },
        product: { id: product.id },
      });

      cart.updated = now;

      await em.persistAndFlush(cartProduct);
      await em.persistAndFlush(cart);
    }

    return CartDto.fromEntity(cart);
  }

  async updateProductInCart(
    userId: string,
    cartProductId: string,
    quantity: number,
  ) {
    const em = this.cartRepo.getEntityManager();

    const [cart, product] = await Promise.all([
      this.cartRepo.findOne({ user: { id: userId } }, { populate: true }),
      this.productsRepo.findOne({
        cartProduct: { id: cartProductId },
      }),
    ]);

    const cartProduct = await this.cartProductsRepo.findOne({
      id: cartProductId,
    });

    await cart.products.init();
    console.log(await CartProductDto.fromCollection(cart.products));

    if (!cartProduct) {
      throw new BadRequestException('No such item in cart');
    }

    if (product.quantity < quantity) {
      throw new NotAcceptableException('Not enough in stock');
    }

    const now = new Date();

    if (cartProduct) {
      cartProduct.quantity = quantity;
      cart.updated = now;

      await em.persistAndFlush(cartProduct);
      await em.persistAndFlush(cart);
    } else {
      const cartProduct = this.cartProductsRepo.create({
        name: product.name,
        category: product.category,
        quantity,
        description: product.description,
        cart: { id: cart.id },
        product: { id: product.id },
      });

      cart.updated = now;

      await em.persistAndFlush(cartProduct);
      await em.persistAndFlush(cart);
    }

    return CartDto.fromEntity(cart);
  }

  async clearCart(userId: string) {
    const cart = await this.cartRepo.findOne(
      { user: { id: userId } },
      { populate: true },
    );
    const em = this.cartRepo.getEntityManager();

    await cart.products.init();

    this.cartProductsRepo.nativeDelete({ cart: { id: cart.id } });

    const cleared = wrap(cart).assign({ products: [] }, { mergeObjects: true });
    await em.persistAndFlush(cleared);

    return CartDto.fromEntity(cart);
  }
}
