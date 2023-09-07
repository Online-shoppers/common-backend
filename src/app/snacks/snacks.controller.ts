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

import { CreateSnackForm } from './dto/create-snack.form';
import { SnacksPaginationResponse } from './dto/pagination-response.dto';
import { SnacksDTO } from './dto/snack.dto';
import { UpdateSnackForm } from './dto/update-snack.form';
import { SnackSorting } from './enums/snack-sorting.enum';
import { SnacksService } from './snacks.service';

@ApiTags('Snack')
@Controller('snacks')
export class SnacksController {
  constructor(private readonly snacksService: SnacksService) {}

  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'size', type: Number, required: false })
  @ApiQuery({ name: 'includeArchived', type: Boolean, required: false })
  @ApiQuery({
    name: 'sortOption',
    type: 'enum',
    enum: SnackSorting,
    required: false,
  })
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
    @Query('sortOption', new ParseEnumPipe(SnackSorting))
    sortOptin: SnackSorting,
  ) {
    return this.snacksService.getPageSnacks(
      page,
      size,
      includeArchived,
      sortOptin,
    );
  }

  @Get(':id')
  @ApiResponse({ type: SnacksDTO })
  async getSnacksById(
    @Param('id', ParseUUIDPipe) id: string,
    @I18nLang() lang: string,
  ) {
    const entity = await this.snacksService.getSnackById(id, lang);
    return SnacksDTO.fromEntity(entity);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiBody({ type: CreateSnackForm })
  @ApiResponse({ type: SnacksDTO })
  @Post()
  async createSnack(@Body() snacksData: CreateSnackForm) {
    const dto = CreateSnackForm.from(snacksData);
    return this.snacksService.createSnack(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiBody({ type: UpdateSnackForm })
  @ApiResponse({ type: SnacksDTO })
  @Put(':id')
  async updateSnack(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateSnackForm,
    @I18nLang() lang: string,
  ) {
    const dto = UpdateSnackForm.from(updateData);
    return this.snacksService.updateSnack(id, dto, lang);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiResponse({ type: SnacksDTO })
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @I18nLang() lang: string,
  ) {
    return this.snacksService.archiveSnack(id, lang);
  }
}
