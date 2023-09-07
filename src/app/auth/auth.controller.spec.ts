import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';

import { TokensDto } from '../security/dto/tokens.dto';
import { SecurityService } from '../security/security.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserSignInForm } from './dto/user-sign-in.form';
import { UserSignUpForm } from './dto/user-sign-up.form';

const authServiceMock = {
  signUp: jest.fn().mockResolvedValue({}),
  signIn: jest.fn().mockResolvedValue({}),
};

const securityServiceMock = {
  refreshTokens: jest.fn().mockResolvedValue({}),
};

const i18nServiceMock = {
  translate: jest.fn().mockResolvedValue('hello'),
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let securityService: SecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SecurityService, useValue: securityServiceMock },
        { provide: I18nService, useValue: i18nServiceMock },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    securityService = module.get<SecurityService>(SecurityService);
  });

  describe('signUp', () => {
    it('should return TokensDto when sign-up is successful', async () => {
      const signUpData: UserSignUpForm = {
        email: 'test@example.com',
        password: 'password',
        passwordConfirm: 'password',
        firstName: 'John',
        lastName: 'Doe',
      };

      const expectedResult: any = {
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
      };

      jest.spyOn(authService, 'signUp').mockResolvedValue(expectedResult);

      const lang: any = 'en';

      const tokens: TokensDto = await authController.signUp(signUpData, lang);

      expect(tokens).toEqual(expectedResult);
    });

    it('should throw BadRequestException when sign-up fails', async () => {
      const signUpData: UserSignUpForm = {
        email: 'test@example.com',
        password: 'password',
        passwordConfirm: 'invalid-password',
        firstName: 'John',
        lastName: 'Doe',
      };

      const errorResponse = new BadRequestException({
        message: 'Invalid form data',
        errors: [],
      });

      jest.spyOn(authService, 'signUp').mockRejectedValue(errorResponse);

      const lang: any = 'en';

      try {
        await authController.signUp(signUpData, lang);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid form data');
      }
    });
  });

  describe('signIn', () => {
    it('should return TokensDto when sign-in is successful', async () => {
      const signInData: UserSignInForm = {
        email: 'test@example.com',
        password: 'password',
      };

      const expectedResult: any = {
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
      };

      jest.spyOn(authService, 'signIn').mockResolvedValue(expectedResult);

      const lang: any = 'en';

      const tokens: TokensDto = await authController.signIn(signInData, lang);

      expect(tokens).toEqual(expectedResult);
    });
  });

  describe('refreshTokens', () => {
    it('should return TokensDto when refreshTokens is successful', async () => {
      const tokensData: TokensDto = {
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
      };

      const expectedResult: any = {
        access_token: 'new_mock_access_token',
        refresh_token: 'new_mock_refresh_token',
      };

      jest
        .spyOn(securityService, 'refreshTokens')
        .mockResolvedValue(expectedResult);

      const lang: any = 'en';

      const tokens: TokensDto = await authController.refreshTokens(
        tokensData,
        lang,
      );

      expect(tokens).toEqual(expectedResult);
    });
  });
});
