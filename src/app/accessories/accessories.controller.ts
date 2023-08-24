import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
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

import {
  JwtPermissionsGuard,
  RestrictRequest,
} from 'app/security/guards/jwt-permission.guard';
import { UserPermissions } from 'app/user-roles/enums/user-permissions.enum';

import { ProductTypes } from 'shared/enums/productTypes.enum';

import { AccessoriesService } from './accessories.service';
import { AccessoryDTO } from './dto/accessory.dto';
import { AccessoryPaginationResponse } from './dto/pagination-response.dto';

@ApiTags('Accessory')
@Controller('accessory')
export class AccessoriesController {
  constructor(private readonly accessoriesService: AccessoriesService) {}

  @ApiOperation({ summary: 'Get all accessories list' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'size', type: Number, required: false })
  @ApiQuery({ name: 'includeArchived', type: Boolean, required: false })
  @ApiResponse({
    type: AccessoryPaginationResponse,
  })
  @Get()
  async getAllAccessories(
    @Query('page', ParseIntPipe)
    page = 1,
    @Query('size', ParseIntPipe)
    size = 20,
    @Query('includeArchived', new ParseBoolPipe({ optional: true }))
    includeArchived = false,
  ) {
    return this.accessoriesService.getPageAccessories(
      page,
      size,
      includeArchived,
    );
  }

  @ApiResponse({ type: AccessoryDTO })
  @Get(':id')
  async getAccessoryById(@Param('id') id: string) {
    const entity = await this.accessoriesService.getAccessoryInfo(id);
    return AccessoryDTO.fromEntity(entity);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiBody({ type: AccessoryDTO })
  @ApiResponse({ type: AccessoryDTO })
  @Post()
  async createAccessory(@Body() accessoryData: Partial<AccessoryDTO>) {
    const validTypes = [
      ProductTypes.BEER_GLASSES,
      ProductTypes.BOTTLE_OPENER,
      ProductTypes.BEER_COASTERS,
    ];
    if (
      !isEnum(accessoryData.type, ProductTypes) ||
      !validTypes.includes(accessoryData.type)
    ) {
      throw new BadRequestException(`Invalid beer type: ${accessoryData.type}`);
    }
    const entity = await this.accessoriesService.createAccessory(accessoryData);
    return AccessoryDTO.fromEntity(entity);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiBody({ type: AccessoryDTO })
  @ApiResponse({ type: AccessoryDTO })
  @Put(':id')
  async updateAccessory(
    @Param('id') id: string,
    @Body() updateData: Partial<AccessoryDTO>,
  ) {
    const updatedAccessory = await this.accessoriesService.updateAccessory(
      id,
      updateData,
    );

    if (!updatedAccessory) {
      throw new NotFoundException(`Accessory with id ${id} not found`);
    }

    return AccessoryDTO.fromEntity(updatedAccessory);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiResponse({ type: AccessoryDTO })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.accessoriesService.archiveAccessory(id);
  }
}
