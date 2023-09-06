import { Collection } from '@mikro-orm/core';
import { NotAcceptableException, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { I18nService } from 'nestjs-i18n';
import { v4 } from 'uuid';

import { CartEntity } from 'app/cart/entities/cart.entity';
import { OrderProductEntity } from 'app/order-item/entity/order-product.entity';
import { ReviewEntity } from 'app/reviews/entities/review.entity';
import { UserRoleEntity } from 'app/user-roles/entities/user-role.entity';
import { UserPermissions } from 'app/user-roles/enums/user-permissions.enum';
import { UserRoles } from 'app/user-roles/enums/user-roles.enum';
import { UserService } from 'app/user/user.service';

import { RefreshTokenRepo } from '../refresh-token/repo/refresh-token.repo';
import { UserEntity } from '../user/entities/user.entity';
import { UserSessionDto } from './dto/user-session.dto';
import { SecurityService } from './security.service';

const mockUserRole: UserRoleEntity = {
  id: v4(),
  name: 'UserRoleName',
  permissions: [UserPermissions.GetUsers, UserPermissions.CanLeaveReviews],
  isDefault: false,
  created: new Date(),
  updated: new Date(),
  type: UserRoles.Client,
};

const mockUser: UserEntity = {
  id: v4(),
  created: new Date(),
  updated: new Date(),
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'password123',
  archived: false,
  cart: new CartEntity(),
  orders: new Collection<OrderProductEntity>(this),
  reviews: new Collection<ReviewEntity>(this),
  role: mockUserRole,
};

const mockUserSessionDto: UserSessionDto = {
  id: v4(),
  email: 'user@example.com',
  role_id: v4(),
  role_type: UserRoles.Client,
  permissions: [UserPermissions.GetUsers, UserPermissions.CanLeaveReviews],
  exp: 999,
};

jest.mock('bcrypt');
const mockUserService = {
  getUserById: jest.fn().mockResolvedValue({}),
  getUserPermissions: jest.fn().mockResolvedValue(''),
};
const mockRefreshTokenRepo = {
  addRefreshToken: jest.fn().mockResolvedValue({}),
  findOne: jest.fn().mockResolvedValue({}),
  nativeDelete: jest.fn().mockResolvedValue({}),
};
const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue({}),
  decode: jest.fn().mockResolvedValue({}),
  verify: jest.fn().mockResolvedValue({}),
};
const mockConfigService = {
  get: jest.fn().mockResolvedValue({}),
};

const i18nServiceMock = {
  translate: jest.fn().mockResolvedValue('value'),
};

describe('SecurityService', () => {
  let securityService: SecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: RefreshTokenRepo,
          useValue: mockRefreshTokenRepo,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: I18nService,
          useValue: i18nServiceMock,
        },
      ],
    }).compile();

    securityService = module.get<SecurityService>(SecurityService);
  });

  it('should be defined', () => {
    expect(securityService).toBeDefined();
  });

  it('should hash a password', async () => {
    const password = 'testpassword';
    const hashedPassword = 'hashedpassword123';

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    const result = await securityService.hashPassword(password);

    expect(result).toEqual(hashedPassword);
  });

  it('should compare passwords correctly', async () => {
    const inputPassword = 'testpassword';
    const hashedPassword = 'hashedpassword123';

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await securityService.comparePassword(
      inputPassword,
      hashedPassword,
    );

    expect(result).toBeTruthy();
  });

  //   it('should generate tokens', async () => {
  //     const userEntity: UserEntity = mockUser;
  //     const permissions: any = await mockUserService.getUserPermissions(
  //       userEntity.id,
  //     );
  //     const payload = UserSessionDto.fromEntity(userEntity, permissions);

  //     (mockUserService.getUserPermissions as jest.Mock).mockResolvedValue(
  //       permissions,
  //     );
  //     (mockUserService.getUserById as jest.Mock).mockResolvedValue(userEntity);
  //     (mockJwtService.signAsync as jest.Mock).mockResolvedValue('access_token');
  //     (mockJwtService.signAsync as jest.Mock).mockResolvedValue('refresh_token');

  //     const result = await securityService.generateTokens(userEntity);

  //     expect(result).toEqual({
  //       access_token: 'access_token',
  //       refresh_token: 'refresh_token',
  //       accessTimeExp: expect.any(Number),
  //       refreshTimeExp: expect.any(Number),
  //     });
  //   });

  it('should generate tokens', async () => {
    const expectedUserId = mockUser.id;
    const expectedUserEmail = mockUser.email;
    const expectedUserPermissions = mockUser.role.permissions;

    const mockAccessToken = 'mockAccessToken';
    const mockRefreshToken = 'mockRefreshToken';
    const expiresIn = 3600;

    mockUserService.getUserPermissions.mockResolvedValue(
      expectedUserPermissions,
    );
    mockJwtService.signAsync
      .mockResolvedValueOnce({ access_token: mockAccessToken, expiresIn })
      .mockResolvedValueOnce({ refresh_token: mockRefreshToken });

    const tokens = await securityService.generateTokens(mockUser);

    expect(mockUserService.getUserPermissions).toHaveBeenCalledWith(
      mockUser.id,
    );
    expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
    expect(mockJwtService.signAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expectedUserId,
        email: expectedUserEmail,
        permissions: expectedUserPermissions,
      }),
      expect.objectContaining({
        secret: 'mockSecret',
        expiresIn: expiresIn,
      }),
    );
    expect(tokens).toEqual({
      access_token: mockAccessToken,
      refresh_token: mockRefreshToken,
      accessTimeExp: expect.any(Number),
      refreshTimeExp: expect.any(Number),
    });
  });

  it('should refresh tokens', async () => {
    const accessToken = 'valid_access_token';
    const refreshToken = 'valid_refresh_token';
    const lang = 'en';

    const validateAccessTokenMock = jest.spyOn(
      securityService,
      'validateAccessToken',
    );
    validateAccessTokenMock.mockReturnValue(true);

    const validateRefreshTokenMock = jest.spyOn(
      securityService,
      'validateRefreshToken',
    );
    validateRefreshTokenMock.mockResolvedValue(true);

    (mockJwtService.decode as jest.Mock).mockReturnValue({ id: 'user_id' });

    (mockUserService.getUserById as jest.Mock).mockResolvedValue(mockUser);

    (mockJwtService.signAsync as jest.Mock).mockResolvedValue(
      'new_access_token',
    );
    (mockJwtService.signAsync as jest.Mock).mockResolvedValue(
      'new_refresh_token',
    );

    const result = await securityService.refreshTokens(
      accessToken,
      refreshToken,
      lang,
    );

    expect(result).toEqual({
      access_token: 'new_access_token',
      refresh_token: 'new_refresh_token',
      accessTimeExp: expect.any(Number),
      refreshTimeExp: expect.any(Number),
    });

    validateAccessTokenMock.mockRestore();
    validateRefreshTokenMock.mockRestore();
  });

  it('should throw an error for invalid tokens', async () => {
    const accessToken = 'invalid_access_token';
    const refreshToken = 'invalid_refresh_token';
    const lang = 'en';

    const validateAccessTokenMock = jest.spyOn(
      securityService,
      'validateAccessToken',
    );
    validateAccessTokenMock.mockReturnValue(false);

    const validateRefreshTokenMock = jest.spyOn(
      securityService,
      'validateRefreshToken',
    );
    validateRefreshTokenMock.mockResolvedValue(false);

    await expect(
      securityService.refreshTokens(accessToken, refreshToken, lang),
    ).rejects.toThrowError(NotAcceptableException);

    validateAccessTokenMock.mockRestore();
    validateRefreshTokenMock.mockRestore();
  });

  it('should validate refresh token', async () => {
    const refreshToken = 'refresh_token';

    (mockConfigService.get as jest.Mock).mockReturnValue('secret_key');
    (mockRefreshTokenRepo.findOne as jest.Mock).mockResolvedValue({
      token: refreshToken,
    });
    (mockJwtService.verify as jest.Mock).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    const result = await securityService.validateRefreshToken(refreshToken);

    expect(result).toBeTruthy();
  });

  it('should validate access token', async () => {
    const accessToken = 'access_token';

    (mockConfigService.get as jest.Mock).mockReturnValue('secret_key');
    (mockJwtService.verify as jest.Mock).mockReturnValue({
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    const result = await securityService.validateAccessToken(accessToken);

    expect(result).toBeTruthy();
  });
});
