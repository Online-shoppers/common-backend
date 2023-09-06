import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import passport from 'passport';
import { Strategy } from 'passport-jwt';

import { AtStrategyService } from './at-strategy.service';
import { SecurityService } from './security.service';

describe('AtStrategyService', () => {
  let atStrategyService: AtStrategyService;
  const mockConfigService = {
    get: jest.fn(),
  };
  const mockI18nService = {
    translate: jest.fn(),
  };
  const mockSecurityService = {
    getUserById: jest.fn(),
  };
  const mockDone = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    mockConfigService.get.mockReturnValue('your_mock_secret_key');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AtStrategyService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
        {
          provide: SecurityService,
          useValue: mockSecurityService,
        },
      ],
    }).compile();

    atStrategyService = module.get<AtStrategyService>(AtStrategyService);
  });

  it('should be defined', () => {
    expect(atStrategyService).toBeDefined();
  });

  describe('verify', () => {
    it('should call securityService.getUserById with payload.id', async () => {
      const payload: any = { id: 'user_id' };
      mockSecurityService.getUserById.mockResolvedValueOnce({});

      await atStrategyService.verify(null, payload, mockDone);

      expect(mockSecurityService.getUserById).toHaveBeenCalledWith('user_id');
    });

    it('should call done with null and payload if the user is found', async () => {
      const payload: any = { id: 'user_id' };
      mockSecurityService.getUserById.mockResolvedValueOnce({});

      await atStrategyService.verify(null, payload, mockDone);

      expect(mockDone).toHaveBeenCalledWith(null, payload);
    });

    it('should call done with UnauthorizedException if the user is not found', async () => {
      const payload: any = { id: 'non_existing_user_id' };
      mockSecurityService.getUserById.mockResolvedValueOnce(null);

      await atStrategyService.verify(null, payload, mockDone);

      expect(mockDone).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Unauthorized'),
        }),
        false,
      );
    });
  });
});
