import { Test, TestingModule } from '@nestjs/testing';

import { NewUserRoleForm } from './dto/new-user-role.form';
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
describe('UserRolesController', () => {
  let controller: UserRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRolesController],
      providers: [UserRolesService],
    }).compile();

    controller = module.get<UserRolesController>(UserRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
