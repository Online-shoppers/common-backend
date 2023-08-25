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

import { CreateSnackForm } from './dto/create-snack.form';
import { SnacksPaginationResponse } from './dto/pagination-response.dto';
import { SnacksDTO } from './dto/snack.dto';
import { UpdateSnackForm } from './dto/update-snack.form';
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
    return this.snacksService.createSnack(snacksData);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiBody({ type: UpdateSnackForm })
  @ApiResponse({ type: SnacksDTO })
  @Put(':id')
  async updatedSnacks(
    @Param('id') id: string,
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
  async remove(@Param('id') id: string) {
    return this.snacksService.archiveSnack(id);
  }
}
