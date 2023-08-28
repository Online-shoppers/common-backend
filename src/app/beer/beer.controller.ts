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

import {
  JwtPermissionsGuard,
  RestrictRequest,
} from 'app/security/guards/jwt-permission.guard';
import { UserPermissions } from 'app/user-roles/enums/user-permissions.enum';

import { SortProduct } from 'shared/enums/sort-products.enum';

import { BeerService } from './beer.service';
import { BeerDTO } from './dto/beer.dto';
import { CreateBeerForm } from './dto/create-beer.form';
import { BeerPaginationResponse } from './dto/pagination-response.dto';
import { UpdateBeerForm } from './dto/update-beer.form';
import { BeerSortFields } from './enums/beer-sort-fields.enum';

@ApiTags('Beer')
@Controller('beer')
export class BeerController {
  constructor(private readonly beerService: BeerService) {}

  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'size', type: Number, required: false })
  @ApiQuery({ name: 'includeArchived', type: Boolean, required: false })
  @ApiQuery({ name: 'sortDirection', type: String, required: false })
  @ApiQuery({ name: 'sortByField', type: String, required: false })
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
    @Query('direction') sortDirection: SortProduct,
    @Query('field', new ParseEnumPipe(BeerSortFields))
    sortByField: BeerSortFields,
  ) {
    return this.beerService.getPageBeer(
      page,
      size,
      includeArchived,
      sortDirection,
      sortByField,
    );
  }

  @ApiResponse({ type: BeerDTO })
  @Get(':id')
  async getBeerById(@Param('id', ParseUUIDPipe) id: string) {
    const entity = await this.beerService.getBeerInfo(id);
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
  ) {
    const dto = UpdateBeerForm.from(updateData);
    return this.beerService.updateBeer(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiResponse({ type: BeerDTO })
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.beerService.archiveBeer(id);
  }
}
