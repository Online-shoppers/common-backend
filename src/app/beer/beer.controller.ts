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

import { BeerService } from './beer.service';
import { BeerDTO } from './dto/beer.dto';
import { CreateBeerForm } from './dto/create-beer.form';
import { BeerPaginationResponse } from './dto/pagination-response.dto';
import { UpdateBeerForm } from './dto/update-beer.form';
import { BeerSorting } from './enums/beer-sorting.enum';

@ApiTags('Beer')
@Controller('beer')
export class BeerController {
  constructor(private readonly beerService: BeerService) {}

  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'size', type: Number, required: false })
  @ApiQuery({ name: 'includeArchived', type: Boolean, required: false })
  @ApiQuery({
    name: 'sortOption',
    type: 'enum',
    enum: BeerSorting,
    required: false,
  })
  @ApiResponse({
    type: BeerPaginationResponse,
  })
  @Get()
  async getPageBeer(
    @Query('page', new ParseIntPipe({ optional: true }))
    page = 1,
    @Query('size', new ParseIntPipe({ optional: true }))
    size = 20,
    @Query('includeArchived', new ParseBoolPipe({ optional: true }))
    includeArchived = false,
    @Query('sortOption', new ParseEnumPipe(BeerSorting))
    sortOption: BeerSorting,
  ) {
    return this.beerService.getPageBeer(
      page,
      size,
      includeArchived,
      sortOption,
    );
  }

  @ApiResponse({ type: BeerDTO })
  @Get(':id')
  async getBeerById(
    @Param('id', ParseUUIDPipe) id: string,
    @I18nLang() lang: string,
  ) {
    const entity = await this.beerService.getBeerById(id, lang);
    return BeerDTO.fromEntity(entity);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiBody({ type: CreateBeerForm })
  @ApiResponse({ type: BeerDTO })
  @Post()
  async createBeer(@Body() beerData: CreateBeerForm) {
    const dto = CreateBeerForm.from(beerData);
    return this.beerService.createBeer(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiBody({ type: UpdateBeerForm })
  @ApiResponse({ type: BeerDTO })
  @Put(':id')
  async updateBeer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: UpdateBeerForm,
    @I18nLang() lang: string,
  ) {
    const dto = UpdateBeerForm.from(updateData);
    return this.beerService.updateBeer(id, dto, lang);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiResponse({ type: BeerDTO })
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @I18nLang() lang: string,
  ) {
    return this.beerService.archiveBeer(id, lang);
  }
}
