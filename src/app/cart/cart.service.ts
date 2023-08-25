import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotAcceptableException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { CartProductDto } from 'app/cart-product/dto/cart-product.dto';
import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';
import { ProductEntity } from 'app/products/entities/product.entity';

import { CartDto } from './dto/cart.dto';
import { CartEntity } from './entities/cart.entity';
import { CartRepo } from './repo/cart.repo';

@Injectable()
export class CartService {
  protected readonly logger = new Logger('Cart Service');

  constructor(
    private readonly cartRepo: CartRepo,
    @InjectRepository(ProductEntity)
    private readonly productsRepo: EntityRepository<ProductEntity>,
    @InjectRepository(CartProductEntity)
    private readonly cartProductsRepo: EntityRepository<CartProductEntity>, // private readonly entityManager: EntityManager,
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

    await this.cartProductsRepo.nativeDelete({ cart: { id: cart.id } });

    const cleared = wrap(cart).assign({ products: [] }, { mergeObjects: true });
    await em.persistAndFlush(cleared);

    return CartDto.fromEntity(cart);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async notifyAbandonedCarts() {
    const now = Date.now();

    const fifteenMinutesAgo = new Date(now - 15 * 60 * 1000);

    const em = this.cartRepo.getEntityManager().fork();

    const abandonedCarts = await em.find(
      CartEntity,
      {
        updated: { $lte: fifteenMinutesAgo },
        products: { quantity: { $gte: 1 } },
      },
      { populate: ['user.email'] },
    );

    const emails = abandonedCarts.map(cart => cart.user.email);

    this.logger.log(emails.join(', ').concat(' have abandoned cart'));
  }
}
