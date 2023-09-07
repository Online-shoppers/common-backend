import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

import { CartProductEntity } from '../cart-product/entities/cart-product.entity';
import { ProductCategories } from '../products/enums/product-categories.enum';
import { UserSessionDto } from '../security/dto/user-session.dto';
import { UserPermissions } from '../user-roles/enums/user-permissions.enum';
import { UserRoles } from '../user-roles/enums/user-roles.enum';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartEntity } from './entities/cart.entity';

const cartServiceMock = {
  getUsersCart: jest.fn(),
  getUserCartProducts: jest.fn(),
  getUserCartInfo: jest.fn(),
  addProductToCart: jest.fn(),
  updateProductInCart: jest.fn(),
  deleteProductFromCart: jest.fn(),
  clearCart: jest.fn(),
};
describe('CartController', () => {
  let controller: CartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [{ provide: CartService, useValue: cartServiceMock }],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findCart should call getUsersCart and return user cart', async () => {
    const user: UserSessionDto = {
      id: '1',
      email: 'y.y.37@mail.ru',
      role_id: '95457c20-4bca-11ee-a338-6b770323fd2d',
      role_type: UserRoles.Client,
      permissions: [UserPermissions.All],
    };
    const cart: CartEntity = {
      id: v4(),
      created: new Date(),
      updated: new Date(),
      user: null,
      products: null,
      async total(): Promise<number> {
        return 0;
      },
    };

    cartServiceMock.getUsersCart.mockResolvedValue(cart);

    const result = await controller.findCart(user);

    expect(result).toEqual(cart);
  });

  it('findCartProducts should call getUserCartProducts and return user cart products', async () => {
    const cartProducts: CartProductEntity[] = [
      {
        id: v4(),
        created: new Date(),
        updated: new Date(),
        name: '123',
        description: '231',
        category: ProductCategories.BEER,
        quantity: 1,
        cart: null,
        product: null,
        unitPrice(): number {
          return 0;
        },
      },
    ];
    const user: UserSessionDto = {
      id: '1',
      email: 'y.y.37@mail.ru',
      role_id: '95457c20-4bca-11ee-a338-6b770323fd2d',
      role_type: UserRoles.Client,
      permissions: [UserPermissions.All],
    };

    cartServiceMock.getUserCartProducts.mockResolvedValue(cartProducts);

    const result = await controller.findCartProducts(user);

    expect(result).toEqual(cartProducts);
  });

  it('getCartInfo should call getUserCartInfo and return cart info', async () => {
    const user: UserSessionDto = {
      id: '1',
      email: 'y.y.37@mail.ru',
      role_id: '95457c20-4bca-11ee-a338-6b770323fd2d',
      role_type: UserRoles.Client,
      permissions: [UserPermissions.All],
    };
    const cartInfo: CartProductEntity = {
      id: v4(),
      created: new Date(),
      updated: new Date(),
      name: '123',
      description: '231',
      category: ProductCategories.BEER,
      quantity: 1,
      cart: null,
      product: null,
      unitPrice(): number {
        return 0;
      },
    };

    cartServiceMock.getUserCartInfo.mockResolvedValue(cartInfo);

    const result = await controller.getCartInfo(user);

    expect(result).toEqual(cartInfo);
  });

  it('addProductToCart should call addProductToCart and return added product', async () => {
    const user: UserSessionDto = {
      id: '1',
      email: 'y.y.37@mail.ru',
      role_id: '95457c20-4bca-11ee-a338-6b770323fd2d',
      role_type: UserRoles.Client,
      permissions: [UserPermissions.All],
    };
    const productId = 'product1';
    const quantity = 2;
    const lang = 'en';
    const cartInfo: CartProductEntity = {
      id: v4(),
      created: new Date(),
      updated: new Date(),
      name: '123',
      description: '231',
      category: ProductCategories.BEER,
      quantity: 2,
      cart: null,
      product: null,
      unitPrice(): number {
        return 0;
      },
    };

    cartServiceMock.addProductToCart.mockResolvedValue(cartInfo);

    const result = await controller.addProductToCart(
      productId,
      quantity,
      user,
      lang,
    );

    expect(result).toEqual(cartInfo);
  });

  it('updateProductInCart should call updateProductInCart and return updated product', async () => {
    const user: UserSessionDto = {
      id: '1',
      email: 'y.y.37@mail.ru',
      role_id: '95457c20-4bca-11ee-a338-6b770323fd2d',
      role_type: UserRoles.Client,
      permissions: [UserPermissions.All],
    };
    const cartProductId = 'cartProduct1';
    const quantity = 3;
    const lang = 'en';
    const updatedProduct: CartProductEntity = {
      id: v4(),
      created: new Date(),
      updated: new Date(),
      name: '123',
      description: '231',
      category: ProductCategories.BEER,
      quantity: 2,
      cart: null,
      product: null,
      unitPrice(): number {
        return 0;
      },
    };

    cartServiceMock.updateProductInCart.mockResolvedValue(updatedProduct);

    const result = await controller.updateProductInCart(
      cartProductId,
      quantity,
      user,
      lang,
    );

    expect(result).toEqual(updatedProduct);
  });

  it('deleteProductFromCart should call deleteProductFromCart and return deleted product', async () => {
    const user: UserSessionDto = {
      id: '1',
      email: 'y.y.37@mail.ru',
      role_id: '95457c20-4bca-11ee-a338-6b770323fd2d',
      role_type: UserRoles.Client,
      permissions: [UserPermissions.All],
    };
    const cartProductId = 'cartProduct1';
    const lang = 'en';
    const deletedProduct: CartProductEntity = {
      id: v4(),
      created: new Date(),
      updated: new Date(),
      name: '123',
      description: '231',
      category: ProductCategories.BEER,
      quantity: 2,
      cart: null,
      product: null,
      unitPrice(): number {
        return 0;
      },
    };

    cartServiceMock.deleteProductFromCart.mockResolvedValue(deletedProduct);

    const result = await controller.deleteProductFromCart(
      cartProductId,
      user,
      lang,
    );

    expect(result).toEqual(deletedProduct);
  });

  it('clearCart should call clearCart and return cleared cart', async () => {
    const user: UserSessionDto = {
      id: '1',
      email: 'y.y.37@mail.ru',
      role_id: '95457c20-4bca-11ee-a338-6b770323fd2d',
      role_type: UserRoles.Client,
      permissions: [UserPermissions.All],
    };
    const clearedCart: CartProductEntity = {
      id: v4(),
      created: new Date(),
      updated: new Date(),
      name: '123',
      description: '231',
      category: ProductCategories.BEER,
      quantity: 2,
      cart: null,
      product: null,
      unitPrice(): number {
        return 0;
      },
    };

    cartServiceMock.clearCart.mockResolvedValue(clearedCart);

    const result = await controller.clearCart(user);

    expect(result).toEqual(clearedCart);
  });
});
