import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';

import { UserRoleDto } from './dto/user-role.dto';
import { UserRoleEntity } from './entities/user-role.entity';
import { UserPermissions } from './enums/user-permissions.enum';
import { UserRoles } from './enums/user-roles.enum';
import { UserRolesRepo } from './repos/user-role.repo';
import { UserRolesService } from './user-roles.service';

const mockRole: UserRoleEntity = {
  id: v4(),
  created: new Date(),
  updated: new Date(),
  type: UserRoles.Client,
  name: 'client',
  isDefault: true,
  users: [],
  permissions: [],
};
const userRoleRepoMock = {
  findOneOrFail: jest.fn().mockResolvedValue(mockRole),
  findOne: jest.fn().mockResolvedValue(mockRole),
  create: jest.fn().mockResolvedValue(mockRole),
  getEntityManager: jest.fn(),
};
describe('UserRolesService', () => {
  let service: UserRolesService;
  let userRolesRepo: UserRolesRepo;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRolesService,
        {
          provide: UserRolesRepo,
          useValue: userRoleRepoMock,
        },
      ],
    }).compile();
    userRolesRepo = module.get<UserRolesRepo>(UserRolesRepo);
    service = module.get<UserRolesService>(UserRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRoleById', () => {
    it('should return a role by ID', async () => {
      const result = await service.getRoleById(v4());

      expect(result).toEqual(mockRole);
    });
  });

  describe('getDefaultRole', () => {
    it('should return the default role by type', async () => {
      const roleType = UserRoles.Client;

      const result = await service.getDefaultRole(roleType);

      expect(result).toEqual(mockRole);
    });
  });

  describe('addRole', () => {
    it('should add a new role', async () => {
      const newRoleDto: UserRoleDto = {
        id: '1',
        created: new Date().getDate(),
        updated: new Date().getDate(),
        type: UserRoles.Guest,
        name: 'Guest',
        permissions: [UserPermissions.GetUsers],
        isDefault: true,
      };

      userRoleRepoMock.getEntityManager.mockReturnValue({
        persistAndFlush: jest.fn(),
      });
      const result = await service.addRole(newRoleDto);

      expect(result).toEqual(mockRole);
    });
  });
});
