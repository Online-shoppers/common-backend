import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { isEnum } from 'class-validator';

import { CurrentUser } from 'app/security/decorators/current-user.decorator';
import { UserSessionDto } from 'app/security/dto/user-session.dto';
import {
  JwtPermissionsGuard,
  RestrictRequest,
} from 'app/security/guards/jwt-permission.guard';
import { UserPermissions } from 'app/user-roles/enums/user-permissions.enum';

import { ProductTypes } from 'shared/enums/productTypes.enum';

import { SnacksPaginationResponse } from './dto/pagination-response.dto';
import { SnacksDTO } from './dto/snack.dto';
import { SnacksService } from './snacks.service';

@ApiTags('Snack')
@Controller('snacks')
export class SnacksController {
  constructor(private readonly snacksService: SnacksService) {}

  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'size', type: Number, required: false })
  @ApiQuery({ name: 'includeArchived', type: Boolean, required: false })
  @ApiResponse({
    type: SnacksPaginationResponse,
  })
  @Get()
  async getPageAccessories(
    @Query('page', ParseIntPipe)
    page = 1,
    @Query('size', ParseIntPipe)
    size = 20,
    @Query('includeArchived', new ParseBoolPipe({ optional: true }))
    includeArchived = false,
  ) {
    return this.snacksService.getPageSnacks(page, size, includeArchived);
  }

  @Get(':snacksId')
  @ApiResponse({ type: SnacksDTO })
  async getSnacksById(@Param('snacksId', ParseUUIDPipe) snackId: string) {
    const entity = await this.snacksService.getSnacksInfo(snackId);
    return SnacksDTO.fromEntity(entity);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiBody({ type: SnacksDTO })
  @ApiResponse({ type: SnacksDTO })
  @Post()
  async createSnacks(@Body() snacksData: Partial<SnacksDTO>) {
    const validTypes = [
      ProductTypes.PRETZELS,
      ProductTypes.NACHOS,
      ProductTypes.SPICY_WINGS,
    ];
    if (
      !isEnum(snacksData.type, ProductTypes) ||
      !validTypes.includes(snacksData.type)
    ) {
      throw new BadRequestException(`Invalid beer type: ${snacksData.type}`);
    }
    const entity = await this.snacksService.createSnacks(snacksData);
    return SnacksDTO.fromEntity(entity);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiBody({ type: SnacksDTO })
  @ApiResponse({ type: SnacksDTO })
  @Put(':snackId')
  async updatedSnacks(
    @Param('snackId') snackId: string,
    @Body() updateData: Partial<SnacksDTO>,
  ) {
    const updatedSnacks = await this.snacksService.updateSnacks(
      snackId,
      updateData,
    );

    return SnacksDTO.fromEntity(updatedSnacks);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiResponse({ type: SnacksDTO })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.snacksService.archiveSnacks(id);
  }
}
