import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseEnumPipe,
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
import { I18nLang } from 'nestjs-i18n';

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
import { AccessorySortFields } from './enums/accessory-sort-fields.enum';
import { AccessorySorting } from './enums/accessory-sorting.enum';

@ApiTags('Accessory')
@Controller('accessory')
export class AccessoriesController {
  constructor(private readonly accessoriesService: AccessoriesService) {}

  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'size', type: Number, required: false })
  @ApiQuery({ name: 'includeArchived', type: Boolean, required: false })
  @ApiQuery({
    name: 'sortOption',
    type: 'enum',
    enum: AccessorySorting,
    required: false,
  })
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
    @Query('sortOption', new ParseEnumPipe(AccessorySorting))
    sortOption: AccessorySorting,
  ) {
    return this.accessoriesService.getPageAccessories(
      page,
      size,
      includeArchived,
      sortOption,
    );
  }

  @ApiResponse({ type: AccessoryDTO })
  @Get(':id')
  async getAccessoryById(
    @Param('id', ParseUUIDPipe) id: string,
    @I18nLang() lang: string,
  ) {
    const entity = await this.accessoriesService.getAccessoryById(id, lang);
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
    const entity = await this.accessoriesService.createAccessory(dto);
    return AccessoryDTO.fromEntity(entity);
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
    @I18nLang() lang: string,
  ) {
    const dto = UpdateAccessoryForm.from(updateData);
    return this.accessoriesService.updateAccessory(id, dto, lang);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiResponse({ type: AccessoryDTO })
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @I18nLang() lang: string,
  ) {
    return this.accessoriesService.archiveAccessory(id, lang);
  }
}
