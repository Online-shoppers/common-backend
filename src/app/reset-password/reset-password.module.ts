import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { SecurityModule } from 'app/security/security.module';
import { UserModule } from 'app/user/user.module';

import { ResetPasswordController } from './reset-password.controller';
import { ResetPasswordService } from './reset-password.service';

@Module({
  imports: [UserModule, SecurityModule, JwtModule],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService],
})
export class ResetPasswordModule {}
