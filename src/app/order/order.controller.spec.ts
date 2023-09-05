import { Collection } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';

import { OrderProductEntity } from '../order-item/entity/order-product.entity';
import { ProductCategories } from '../products/enums/product-categories.enum';
import { UserSessionDto } from '../security/dto/user-session.dto';
import { JwtPermissionsGuard } from '../security/guards/jwt-permission.guard';
import { UserPermissions } from '../user-roles/enums/user-permissions.enum';
import { UserRoles } from '../user-roles/enums/user-roles.enum';
import { UserEntity } from '../user/entities/user.entity';
import { OrderDTO } from './dto/order.dto';
import { OrderEntity } from './entities/order.entity';
// Import your OrderProductEntity class
import { OrderStatuses } from './enums/order-statuses.enum';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderGateway } from './orderGateway';

jest.mock('./order.service');
const i18n: any = {
  t: () => {
    return 'some value';
  },
};
const mockOrderGateway = {
  server: {
    emit: jest.fn(),
  },
};

const mockOrderService = {
  findUserOrders: jest.fn(),
  createOrder: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
};
describe('OrderController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        OrderService,
        {
          provide: JwtPermissionsGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
        {
          provide: I18nService,
          useValue: { t: jest.fn(() => 'some value') },
        },
        {
          provide: OrderGateway,
          useValue: mockOrderGateway,
        },
      ],
    })
      .overrideProvider(OrderService)
      .useValue(mockOrderService)
      .compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findUserOrders', () => {
    it('should return user orders', async () => {
      // Create a mock user object with the required properties
      const user: UserSessionDto = {
        id: '1',
        email: 'y.y.37@mail.ru',
        role_id: '95457c20-4bca-11ee-a338-6b770323fd2d',
        role_type: UserRoles.Client,
        permissions: [UserPermissions.All],
      };
      const orders: OrderDTO[] = [
        {
          id: '1',
          created: new Date().getDate(),
          updated: new Date().getDate(),
          status: OrderStatuses.PENDING,
          country: 'USA',
          city: '131',
          zipCode: '12314',
          address: '12312',
          phone: '123131',
          buyerId: '123',
          products: null,
          total: 0,
        },
      ];
      // Mock the OrderDTO.fromEntity method to handle the case where entity.orderProducts is not initialized
      jest.spyOn(OrderDTO, 'fromEntity').mockImplementation(async entity => {
        return {
          // Define your default values here.
          id: entity ? entity.id : '',
          created: entity ? entity.created?.valueOf() : 0,
          updated: entity ? entity.updated?.valueOf() : 0,
          status: entity ? entity.status : '',
          country: entity ? entity.country : '',
          city: entity ? entity.city : '',
          zipCode: entity ? entity.zipCode : '',
          address: entity ? entity.address : '',
          total: 0,
          phone: entity ? entity.phone : '',
          buyerId: entity && entity.buyer ? entity.buyer.id : '',
          products: [], // Empty array or default value for products
        };
      });
      mockOrderService.findUserOrders.mockResolvedValue(orders);
      const result = await controller.findUserOrders(user);

      expect(result).toEqual(orders);
    });
  });
});
