import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { JwtPermissionsGuard } from '../security/guards/jwt-permission.guard';
import { UserService } from '../user/user.service';
import { NewUserRoleForm } from './dto/new-user-role.form';
import { UserRoleDto } from './dto/user-role.dto';
import { UserPermissions } from './enums/user-permissions.enum';
import { UserRoles } from './enums/user-roles.enum';
import { UserRolesController } from './user-roles.controller';
import { UserRolesService } from './user-roles.service';

const mockUserRoleService = {
  addRole: jest.fn().mockImplementation((dto: NewUserRoleForm) => {
    return {
      id: '1',
      created: new Date().getDate(),
      updated: new Date().getDate(),
      type: UserRoles.Client,
      permissions: [UserPermissions.GetUsers],
      isDefault: true,
    };
  }),
};

const userRoleDto: UserRoleDto[] = [
  {
    id: '1',
    created: new Date().getDate(),
    updated: new Date().getDate(),
    type: UserRoles.Guest,
    name: 'Guest',
    permissions: [UserPermissions.GetUsers],
    isDefault: true,
  },
];
describe('UserRolesController', () => {
  let controller: UserRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRolesController],
      providers: [
        UserRolesService,
        {
          provide: JwtPermissionsGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    })
      .overrideProvider(UserRolesService)
      .useValue(mockUserRoleService)
      .compile();

    controller = module.get<UserRolesController>(UserRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('controller method', () => {
    it('should return UserRoleDto', async () => {
      await expect(controller.addRoles(userRoleDto)).resolves.toEqual({
        id: '1',
        created: new Date().getDate(),
        updated: new Date().getDate(),
        type: UserRoles.Client,
        permissions: [UserPermissions.GetUsers],
        isDefault: true,
      });
    });

    it('should return error', async () => {
      try {
        await mockUserRoleService.addRole();
      } catch (e) {
        await expect(controller.addRoles(userRoleDto)).toBeInstanceOf(
          BadRequestException,
        );
      }
    });
  });
});
