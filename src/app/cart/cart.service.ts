import { ArrayCollection, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotAcceptableException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { I18nService } from 'nestjs-i18n';

import { CartProductDto } from 'app/cart-product/dto/cart-product.dto';
import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';
import { ProductsService } from 'app/products/products.service';

import { ErrorCodes } from '../../shared/enums/error-codes.enum';
import { CartInfoDto } from './dto/cart-info.dto';
import { CartDto } from './dto/cart.dto';
import { CartEntity } from './entities/cart.entity';
import { CartRepo } from './repo/cart.repo';

@Injectable()
export class CartService {
  protected readonly logger = new Logger('Cart Service');

  constructor(
    private readonly cartRepo: CartRepo,
    private readonly productsService: ProductsService,
    @InjectRepository(CartProductEntity)
    private readonly cartProductsRepo: EntityRepository<CartProductEntity>,
    private readonly i18nService: I18nService,
  ) {}

  async getUsersCart(userId: string) {
    const cart = await this.cartRepo.findOne(
      { user: { id: userId } },
      { populate: true },
    );

    return CartDto.fromEntity(cart);
  }

  async getUserCartProducts(userId: string) {
    const entities = await this.cartProductsRepo.find(
      {
        cart: { user: { id: userId } },
      },
      {
        populate: ['unitPrice', 'quantity', 'product.image_url'],
        orderBy: {
          quantity: 'desc',
        },
      },
    );

    return CartProductDto.fromEntities(entities);
  }

  async getUserCartInfo(userId: string) {
    const cart = await this.cartRepo.findOne(
      { user: { id: userId } },
      { populate: ['products.product.price', 'products.quantity'] },
    );
    return CartInfoDto.fromEntity(cart);
  }

  async addProductToCart(
    userId: string,
    productId: string,
    quantity: number,
    lang: string,
  ) {
    if (quantity <= 0) {
      throw new BadRequestException(
        this.i18nService.translate(ErrorCodes.FieldQuantityShouldBePositive, {
          lang,
        }),
      );
    }

    const em = this.cartRepo.getEntityManager();

    const [cart, product] = await Promise.all([
      this.cartRepo.findOne({ user: { id: userId } }),
      this.productsService.getProductById(productId, lang),
    ]);

    const cartProduct = await this.cartProductsRepo.findOne({
      cart: { id: cart.id },
      product: { id: product.id },
    });

    if (product.quantity < (cartProduct?.quantity || 0) + quantity) {
      throw new NotAcceptableException(
        this.i18nService.translate(ErrorCodes.NotEnough_Product, {
          lang,
        }),
      );
    }

    const now = new Date();

    if (cartProduct) {
      cartProduct.quantity += quantity;

      await em.persistAndFlush(cartProduct);
    } else {
      const newCartProduct = this.cartProductsRepo.create({
        name: product.name,
        category: product.category,
        quantity,
        description: product.description,
        cart,
        product,
      });
      cart.products.add(newCartProduct);
    }
    cart.updated = now;

    await em.persistAndFlush(cart);

    return CartProductDto.fromEntity(cartProduct);
  }

  async updateProductInCart(
    userId: string,
    cartProductId: string,
    quantity: number,
    lang: string,
  ) {
    const em = this.cartRepo.getEntityManager();

    const [cart, cartProduct] = await Promise.all([
      this.cartRepo.findOne(
        { user: { id: userId } },
        { populate: ['products'] },
      ),
      this.cartProductsRepo.findOne({
        id: cartProductId,
      }),
    ]);

    if (!cartProduct) {
      throw new BadRequestException(
        this.i18nService.translate(ErrorCodes.NoSuchItem_Cart, {
          lang,
        }),
      );
    }

    if (cartProduct.product.quantity < quantity) {
      throw new NotAcceptableException(
        this.i18nService.translate(ErrorCodes.NotEnough_Product, {
          lang,
        }),
      );
    }

    const now = new Date();

    if (!cartProduct) {
      throw new BadRequestException(
        this.i18nService.translate(ErrorCodes.NoSuchItem_Cart, {
          lang,
        }),
      );
    }

    cart.updated = now;

    if (quantity <= 0) {
      cart.products.remove(cartProduct);
      em.remove(cartProduct);
      await em.persistAndFlush(cart);

      return CartProductDto.fromEntity(cartProduct);
    } else {
      cartProduct.quantity = quantity;
      await em.persistAndFlush(cartProduct);
    }

    await em.persistAndFlush(cart);

    return CartProductDto.fromEntity(cartProduct);
  }

  async deleteProductFromCart(
    userId: string,
    cartProductId: string,
    lang: string,
  ) {
    const cart = await this.cartRepo.findOne(
      { user: { id: userId } },
      { populate: true },
    );

    const em = this.cartRepo.getEntityManager();

    try {
      const cartProduct = await this.cartProductsRepo.findOneOrFail({
        id: cartProductId,
      });

      cart.products.remove(cartProduct);
      em.remove(cartProduct);

      cart.updated = new Date();

      await em.persistAndFlush(cart);

      return CartDto.fromEntity(cart);
    } catch (err) {
      throw new BadRequestException(
        this.i18nService.translate(ErrorCodes.NoSuchItem_Cart, {
          lang,
        }),
      );
    }
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
