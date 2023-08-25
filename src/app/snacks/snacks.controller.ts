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
import { IsEnum } from 'class-validator';

import {
  JwtPermissionsGuard,
  RestrictRequest,
} from 'app/security/guards/jwt-permission.guard';
import { UserPermissions } from 'app/user-roles/enums/user-permissions.enum';

import { SortProduct } from 'shared/enums/sort-products.enum';

import { CreateSnackForm } from './dto/create-snack.form';
import { SnacksPaginationResponse } from './dto/pagination-response.dto';
import { SnacksDTO } from './dto/snack.dto';
import { UpdateSnackForm } from './dto/update-snack.form';
import { SnacksEntity } from './entities/snack.entity';
import { SnacksService } from './snacks.service';

@ApiTags('Snack')
@Controller('snacks')
export class SnacksController {
  constructor(private readonly snacksService: SnacksService) {}

  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'size', type: Number, required: false })
  @ApiQuery({ name: 'includeArchived', type: Boolean, required: false })
  @ApiQuery({ name: 'sortDirection', type: IsEnum, required: false })
  @ApiQuery({ name: 'sortByField', type: String, required: false })
  @ApiResponse({
    type: SnacksPaginationResponse,
  })
  @Get()
  async getPageSnacks(
    @Query('page', new ParseIntPipe({ optional: true }))
    page = 1,
    @Query('size', new ParseIntPipe({ optional: true }))
    size = 20,
    @Query('includeArchived', new ParseBoolPipe({ optional: true }))
    includeArchived = false,
    @Query('direction') sortDirection: SortProduct,
    @Query('field') sortByField: string,
  ) {
    return this.snacksService.getPageSnacks(
      page,
      size,
      includeArchived,
      sortDirection,
      sortByField,
    );
  }

  @Get(':id')
  @ApiResponse({ type: SnacksDTO })
  async getSnacksById(@Param('id', ParseUUIDPipe) id: string) {
    const entity = await this.snacksService.getSnackInfo(id);
    return SnacksDTO.fromEntity(entity);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiBody({ type: CreateSnackForm })
  @ApiResponse({ type: SnacksDTO })
  @Post()
  async createSnacks(@Body() snacksData: CreateSnackForm) {
    const dto = CreateSnackForm.from(snacksData);
    return this.snacksService.createSnack(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiBody({ type: UpdateSnackForm })
  @ApiResponse({ type: SnacksDTO })
  @Put(':id')
  async updatedSnacks(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateSnackForm,
  ) {
    const dto = UpdateSnackForm.from(updateData);
    return this.snacksService.updateSnack(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiResponse({ type: SnacksDTO })
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.snacksService.archiveSnack(id);
  }
}
