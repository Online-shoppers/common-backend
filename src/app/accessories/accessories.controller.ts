import {
  Body,
  Controller,
  Delete,
  Get,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  JwtPermissionsGuard,
  RestrictRequest,
} from 'app/security/guards/jwt-permission.guard';
import { UserPermissions } from 'app/user-roles/enums/user-permissions.enum';

import { AccessoriesService } from './accessories.service';
import { AccessoryDTO } from './dto/accessory.dto';
import { CreateAccessoryForm } from './dto/create-accessory.form';
import { AccessoryPaginationResponse } from './dto/pagination-response.dto';
import { UpdateAccessoryForm } from './dto/update-accessory.form';

@ApiTags('Accessory')
@Controller('accessory')
export class AccessoriesController {
  constructor(private readonly accessoriesService: AccessoriesService) {}

  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'size', type: Number, required: false })
  @ApiQuery({ name: 'includeArchived', type: Boolean, required: false })
  @ApiResponse({
    type: AccessoryPaginationResponse,
  })
  @Get()
  async getPageAccessories(
    @Query('page', new ParseIntPipe({ optional: true }))
    page = 1,
    @Query('size', new ParseIntPipe({ optional: true }))
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
  async getAccessoryById(@Param('id', ParseUUIDPipe) id: string) {
    const entity = await this.accessoriesService.getAccessoryInfo(id);
    return AccessoryDTO.fromEntity(entity);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiBody({ type: CreateAccessoryForm })
  @ApiResponse({ type: AccessoryDTO })
  @Post()
  async createAccessory(@Body() accessoryData: CreateAccessoryForm) {
    const dto = CreateAccessoryForm.from(accessoryData);
    return this.accessoriesService.createAccessory(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiBody({ type: UpdateAccessoryForm })
  @ApiResponse({ type: AccessoryDTO })
  @Put(':id')
  async updateAccessory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateAccessoryForm,
  ) {
    const dto = UpdateAccessoryForm.from(updateData);
    return this.accessoriesService.updateAccessory(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiResponse({ type: AccessoryDTO })
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessoriesService.archiveAccessory(id);
  }
}
