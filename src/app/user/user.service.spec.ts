import { BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { v4 } from 'uuid';

import { UserEvent } from '../../shared/notifications/user/user.event';
import { UserRoleEntity } from '../user-roles/entities/user-role.entity';
import { UserRoles } from '../user-roles/enums/user-roles.enum';
import { UserRolesService } from '../user-roles/user-roles.service';
import { NewUserForm } from './dtos/new-user.form';
import { UserDto } from './dtos/user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRepo } from './repos/user.repo';
import { UserService } from './user.service';

const mockUserRepo = {
  findOne: jest.fn(),
  findOneOrFail: jest.fn(),
  create: jest.fn(),
  getEntityManager: jest.fn(),
};
const mockUserRolesService = {
  getDefaultRole: jest.fn(),
  getRoleById: jest.fn(),
};

const mockI18nService = {
  translate: jest.fn(),
};

const mockEventEmitter = {
  emit: jest.fn(),
};
const userEmail = 'test@example.com';
const mockUser: UserEntity = {
  id: v4(),
  created: new Date(),
  updated: new Date(),
  email: userEmail,
  firstName: '123',
  lastName: '1321',
  password: '2131',
  archived: false,
  cart: null,
  orders: null,
  reviews: null,
  refreshTokens: null,
  role: {
    id: v4(),
    created: new Date(),
    updated: new Date(),
    type: UserRoles.Client,
    name: 'client',
    isDefault: true,
    users: [],
    permissions: [],
  },
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepo,
          useValue: mockUserRepo,
        },
        {
          provide: UserRolesService,
          useValue: mockUserRolesService,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserByEmail(userEmail);

      expect(result).toEqual(mockUser);
    });
  });
  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const userId = v4();

      mockUserRepo.findOneOrFail.mockResolvedValue(mockUser);

      const result = await service.getUserById(userId);

      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException if user does not exist', async () => {
      const userId = v4();

      mockUserRepo.findOneOrFail.mockRejectedValue(
        new BadRequestException('User not found'),
      );

      await expect(service.getUserById(userId)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('addNewUser', () => {
    it('should add a new user', async () => {
      const newUserDto: NewUserForm = {
        email: 'dto.email',
        password: 'dto.password',
        passwordConfirm: 'dto.password',
        firstName: 'dto.firstName',
        lastName: 'dto.lastName',
      };

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

      mockUserRolesService.getDefaultRole.mockResolvedValue(mockRole);
      mockUserRepo.create.mockReturnValue(mockUser);
      mockUserRepo.getEntityManager.mockReturnValue({
        persistAndFlush: jest.fn(),
      });

      const result = await service.addNewUser(newUserDto);

      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserInfo', () => {
    it('should return user info by ID', async () => {
      mockUserRepo.findOneOrFail.mockResolvedValue(mockUser);

      const result = await service.getUserInfo(v4(), 'ru');

      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException if user does not exist', async () => {
      mockUserRepo.findOneOrFail.mockRejectedValue(
        new BadRequestException('User not found'),
      );

      await expect(service.getUserInfo(v4(), 'ru')).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('getUserPermissions', () => {
    it('should return user permissions', async () => {
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
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockUserRolesService.getRoleById.mockResolvedValue(mockRole);

      const result = await service.getUserPermissions(v4());

      expect(result).toEqual([]);
    });
  });

  describe('archiveUser', () => {
    it('should archive a user', async () => {
      const em = {
        persistAndFlush: jest.fn(),
      };

      mockUserRepo.getEntityManager.mockReturnValue(em);
      mockUserRepo.findOne.mockResolvedValue(mockUser);

      const result = await service.archiveUser(v4());

      expect(result).toEqual(UserDto.fromEntity(mockUser));
      expect(mockUserRepo.getEntityManager).toHaveBeenCalled();
      expect(em.persistAndFlush).toHaveBeenCalledWith(mockUser);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'delete.user',
        expect.any(UserEvent),
      );
    });
  });
});
