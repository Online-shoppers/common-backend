import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';

import { SecurityService } from '../security/security.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { UserSignInForm } from './dto/user-sign-in.form';
import { UserSignUpForm } from './dto/user-sign-up.form';

const lang = 'en';

const userServiceMock = {
  getUserByEmail: jest.fn(),
  addNewUser: jest.fn(),
};

const securityServiceMock = {
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
  generateTokens: jest.fn(),
};

const i18nServiceMock = {
  translate: jest.fn().mockResolvedValue('value'),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userServiceMock },
        { provide: SecurityService, useValue: securityServiceMock },
        {
          provide: I18nService,
          useValue: i18nServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    it('should sign up a new user and return tokens', async () => {
      const signUpDto: any = {
        email: 'test@example.com',
        password: 'password',
      };

      userServiceMock.getUserByEmail.mockResolvedValue(null);
      securityServiceMock.hashPassword.mockResolvedValue('hashedPassword');
      userServiceMock.addNewUser.mockResolvedValue({});
      securityServiceMock.generateTokens.mockResolvedValue({});

      const result = await authService.signUp(signUpDto, lang);

      expect(result).toEqual({});
    });

    it('should throw BadRequestException if user already exists', async () => {
      const signUpDto: any = {
        email: 'test@example.com',
        password: 'password',
      };

      userServiceMock.getUserByEmail.mockResolvedValue({});

      await expect(authService.signUp(signUpDto, lang)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('signIn', () => {
    it('should sign in a user and return tokens', async () => {
      const signInDto: UserSignInForm = {
        email: 'test@example.com',
        password: 'password',
      };
      const userEntity = {
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      userServiceMock.getUserByEmail.mockResolvedValue(userEntity);
      securityServiceMock.comparePassword.mockResolvedValue(true);
      securityServiceMock.generateTokens.mockResolvedValue({});

      const result = await authService.signIn(signInDto, lang);

      expect(result).toEqual({});
    });

    it('should throw ForbiddenException if user does not exist', async () => {
      const signInDto: UserSignInForm = {
        email: 'test@example.com',
        password: 'password',
      };

      userServiceMock.getUserByEmail.mockResolvedValue(null);

      await expect(authService.signIn(signInDto, lang)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException if password is incorrect', async () => {
      const signInDto: UserSignInForm = {
        email: 'test@example.com',
        password: 'password',
      };
      const userEntity = {
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      userServiceMock.getUserByEmail.mockResolvedValue(userEntity);
      securityServiceMock.comparePassword.mockResolvedValue(false);

      await expect(authService.signIn(signInDto, lang)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
