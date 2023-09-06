import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

import { CartProductEntity } from '../cart-product/entities/cart-product.entity';
import { CartProductRepo } from '../cart-product/repo/cart-product.repo';
import { OrderProductRepo } from '../order-item/repo/order-product.repo';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductCategories } from '../products/enums/product-categories.enum';
import { ProductTypes } from '../products/enums/product-types.enum';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { NewOrderForm } from './dto/new-order.form';
import { OrderEntity } from './entities/order.entity';
import { OrderStatuses } from './enums/order-statuses.enum';
import { OrderService } from './order.service';
import { OrderRepo } from './repo/order.repo';

const mockUserService = {
  getUserById: jest.fn(),
};

const mockCartProductRepo = {
  find: jest.fn(),
  nativeDelete: jest.fn(),
};

const mockOrderProductRepo = {
  create: jest.fn(),
};
const em = {
  persistAndFlush: jest.fn(),
};
const mockOrderRepo = {
  create: jest.fn(),
  getEntityManager: jest.fn().mockReturnValue(em),
  findOneOrFail: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  nativeDelete: jest.fn(),
  persistAndFlush: jest.fn(),
};
describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: CartProductRepo,
          useValue: mockCartProductRepo,
        },
        {
          provide: OrderProductRepo,
          useValue: mockOrderProductRepo,
        },
        {
          provide: OrderRepo,
          useValue: mockOrderRepo,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should find an order by ID', async () => {
      const orderId = 'order123';
      const order: OrderEntity = {
        id: orderId,
        updated: new Date(),
        created: new Date(),
        address: 'pw1e',
        phone: '123',
        zipCode: '123',
        city: '123',
        country: '123',
        status: OrderStatuses.PENDING,
        async getTotal(): Promise<number> {
          return 0;
        },
        buyer: null,
        orderProducts: null,
      };
      mockOrderRepo.findOne.mockResolvedValue(order);

      const result = await service.findOne(orderId);

      expect(result).toEqual(order);
    });
  });
  describe('findUserOrders', () => {
    it('should find user orders', async () => {
      // Arrange
      const userId = 'user123';
      const userOrders = [
        {
          id: 'orderId',
          updated: new Date(),
          created: new Date(),
          address: 'pw1e',
          phone: '123',
          zipCode: '123',
          city: '123',
          country: '123',
          status: OrderStatuses.PENDING,
          async getTotal(): Promise<number> {
            return 0;
          },
          buyer: null,
          orderProducts: null,
        },
        {
          id: 'orderI',
          updated: new Date(),
          created: new Date(),
          address: 'pw1e',
          phone: '123',
          zipCode: '123',
          city: '123',
          country: '123',
          status: OrderStatuses.PENDING,
          async getTotal(): Promise<number> {
            return 0;
          },
          buyer: null,
          orderProducts: null,
        },
      ];
      mockOrderRepo.find.mockResolvedValue(userOrders);

      const result = await service.findUserOrders(userId);

      expect(result).toEqual(userOrders);
    });
  });

  describe('getOrderById', () => {
    it('should get an order by ID', async () => {
      // Arrange
      const orderId = 'order123';
      const order: OrderEntity = {
        id: orderId,
        updated: new Date(),
        created: new Date(),
        address: 'pw1e',
        phone: '123',
        zipCode: '123',
        city: '123',
        country: '123',
        status: OrderStatuses.PENDING,
        async getTotal(): Promise<number> {
          return 0;
        },
        buyer: null,
        orderProducts: null,
      };
      mockOrderRepo.findOneOrFail.mockResolvedValue(order);

      const result = await service.getOrderById(orderId);

      expect(result).toEqual(order);
    });
  });

  describe('remove', () => {
    it('should remove an order by ID', async () => {
      // Arrange
      const orderId = 'order123';

      await service.remove(orderId);

      expect(mockOrderRepo.nativeDelete).toHaveBeenCalledWith({ id: orderId });
    });
  });

  describe('update', () => {
    it('should update the status of an order', async () => {
      // Arrange
      const orderId = 'order123';
      const status = OrderStatuses.SHIPPED;
      const existingOrder = {
        id: orderId,
        status: OrderStatuses.PENDING,
      };

      mockOrderRepo.findOneOrFail.mockResolvedValue(existingOrder);

      // Act
      const result = await service.update(orderId, status);

      // Assert
      expect(result).toEqual({ ...existingOrder, status });
      expect(mockOrderRepo.findOneOrFail).toHaveBeenCalledWith({ id: orderId });
    });

    it('should throw an error if the order does not exist', async () => {
      // Arrange
      const orderId = 'nonExistentOrder';
      const status = OrderStatuses.SHIPPED;

      mockOrderRepo.findOneOrFail.mockRejectedValue(
        new Error('Order not found'),
      );

      // Act and Assert
      await expect(async () => {
        await service.update(orderId, status);
      }).rejects.toThrowError('Order not found');

      expect(mockOrderRepo.findOneOrFail).toHaveBeenCalledWith({ id: orderId });
      expect(mockOrderRepo.persistAndFlush).toHaveBeenCalledTimes(0);
    });
  });

  describe('createOrder', () => {
    it('should create an order with cart products', async () => {
      const userId = 'user123';
      const orderForm: NewOrderForm = {
        firstName: '123',
        lastName: '123',
        country: 'USA',
        city: 'New York',
        zipCode: '10001',
        address: '123 Main St',
        phone: '123-456-7890',
      };

      const userEntity: UserEntity = {
        id: v4(),
        created: new Date(),
        updated: new Date(),
        firstName: '123',
        lastName: '123',
        password: '123',
        cart: null,
        orders: null,
        email: '213',
        archived: false,
        reviews: null,
      };
      const product: ProductEntity = {
        id: '13',
        created: new Date(),
        updated: new Date(),
        archived: false,
        name: '13',
        price: 123,
        description: '123',
        image_url: '123',
        quantity: 1,
        async rating(): Promise<number> {
          return 0;
        },
        async reviewsAmount(): Promise<number> {
          return 0;
        },
        category: ProductCategories.BEER,
        type: ProductTypes.BEER_COASTERS,
        reviews: null,
        cartProducts: null,
      };
      const cartProducts: CartProductEntity[] = [
        {
          name: 'Product 1',
          description: 'Product 1 description',
          category: ProductCategories.BEER,
          product: product,
          cart: null,
          quantity: 2,
          id: v4(),
          created: new Date(),
          updated: new Date(),
          unitPrice(): number {
            return 0;
          },
        },
      ];
      const order: OrderEntity = {
        id: 'orderId',
        updated: new Date(),
        created: new Date(),
        address: 'pw1e',
        phone: '123',
        zipCode: '123',
        city: '123',
        country: '123',
        status: OrderStatuses.PENDING,
        async getTotal(): Promise<number> {
          return 0;
        },
        buyer: null,
        orderProducts: null,
      };
      const mockOrder = {
        orderProducts: {
          add: jest.fn(),
        },
      };
      mockCartProductRepo.find.mockResolvedValue(cartProducts);
      mockUserService.getUserById.mockResolvedValue(userEntity);

      mockOrderRepo.create.mockReturnValue(mockOrder);
      mockOrderProductRepo.create.mockReturnValue(cartProducts); // Mock the created order product

      // Act
      const result = await service.createOrder(userId, orderForm);

      // Assert
      expect(result).toBeDefined();
    });
  });
});
