import { Test, TestingModule } from '@nestjs/testing';

import { SecurityService } from 'app/security/security.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const authServiceMock = {};
const securityServiceMock = {};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SecurityService, useValue: securityServiceMock },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
