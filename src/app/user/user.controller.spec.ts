import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';

import { UserSessionDto } from '../security/dto/user-session.dto';
import { JwtPermissionsGuard } from '../security/guards/jwt-permission.guard';
import { UserPermissions } from '../user-roles/enums/user-permissions.enum';
import { UserRoles } from '../user-roles/enums/user-roles.enum';
import { UserDto } from './dtos/user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const user: UserDto = {
  email: 'y.y.37@mail.ru',
  firstName: 'Johny',
  lastName: 'Johns',
  password: 'password',
  archived: true,
  id: '95457c20-4bca-11ee-a338-6b770323fd2d',
  created: new Date().getDate(),
  updated: new Date().getDate(),
};
const userSession: UserSessionDto = {
  id: '1',
  email: 'y.y.37@mail.ru',
  role_id: '95457c20-4bca-11ee-a338-6b770323fd2d',
  role_type: UserRoles.Client,
  permissions: [UserPermissions.All],
};
const i18n: any = {
  t: () => {
    return 'some value';
  },
};

const mockUserService = {
  // getUserByEmail: jest.fn().mockResolvedValue((email: string) => {
  //   if (email === 'fake-email') return null;
  //   return {
  //     id: 'daa748d0-4bc9-11ee-a338-6b770323fd2d',
  //     created: '',
  //     updated: 'date',
  //     email: 'y.y.38@mail.ru',
  //     firstName: 'John',
  //     lastName: 'Johnson',
  //     password: 'password',
  //     archived: false,
  //     roleId: 1,
  //     roleType: UserRoles.SuperAdmin,
  //   };
  // }),
  // getUserById: jest.fn().mockResolvedValue((id: string) => {
  //   if (id === 'fake-id') return null;
  //   return {
  //     id: '95457c20-4bca-11ee-a338-6b770323fd2d',
  //     created: '',
  //     updated: 'date',
  //     email: 'y.y.37@mail.ru',
  //     firstName: 'Johny',
  //     lastName: 'Johns',
  //     password: 'password',
  //     archived: false,
  //     roleId: 1,
  //     roleType: UserRoles.Client,
  //   };
  // }),
  // addNewUser: jest.fn().mockImplementation((dto: NewUserForm) => {
  //   return {
  //     id: '95457c20-4bca-11ee-a338-6b770323fd2d',
  //     created: new Date().getDate(),
  //     updated: new Date().getDate(),
  //     roleId: 1,
  //     roleType: UserRoles.Client,
  //     email: dto.email,
  //     password: dto.password,
  //     firstName: dto.firstName,
  //     lastName: dto.lastName,
  //   };
  // }),
  getUserInfo: jest.fn().mockImplementation((userId: string) => {
    if (userId === 'fake-id') return null;
    return {
      id: '95457c20-4bca-11ee-a338-6b770323fd2d',
      created: '',
      updated: 'date',
      email: 'y.y.37@mail.ru',
      firstName: 'Johny',
      lastName: 'Johns',
      password: 'password',
    };
  }),

  archiveUser: jest.fn().mockImplementation((userId: string) => {
    if (userId === 'fake-id') throw new ForbiddenException();
    return {
      email: 'y.y.37@mail.ru',
      firstName: 'Johny',
      lastName: 'Johns',
      password: 'password',
      archived: true,
      id: '95457c20-4bca-11ee-a338-6b770323fd2d',
      created: new Date().getDate(),
      updated: new Date().getDate(),
    };
  }),
};
describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: JwtPermissionsGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
        {
          provide: I18nService,
          useValue: { t: jest.fn(() => 'some value') },
        },
      ],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('user controller 2 methods', () => {
    it('should return error', async () => {
      try {
        await mockUserService.getUserInfo('fake-id');
      } catch (e) {
        expect(controller.getUserById('fake-id', 'ru')).toBeInstanceOf(
          BadRequestException,
        );
      }
    });

    it('should return user by id', async () => {
      await expect(
        controller.getUserById('95457c20-4bca-11ee-a338-6b770323fd2d', 'ru'),
      ).resolves.toEqual(await mockUserService.getUserInfo());
    });

    it('should archive the user', async () => {
      mockUserService.archiveUser.mockResolvedValue(user);

      await expect(
        controller.remove('1', userSession, i18n, 'ru'),
      ).resolves.toEqual(user);
    });

    it('should return error', async () => {
      try {
        await mockUserService.archiveUser();
      } catch (e) {
        await expect(
          controller.remove(
            '95457c20-4bca-11ee-a338-6b770323fd2d',
            userSession,
            i18n,
            'en',
          ),
        ).toBeInstanceOf(ForbiddenException);
      }
    });
    it('should return error user does not exist', async () => {
      try {
        await mockUserService.archiveUser();
      } catch (e) {
        await expect(controller.remove('', null, i18n, 'en')).toBeInstanceOf(
          ForbiddenException,
        );
      }
    });
  });
});
