import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
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

import { BeerService } from './beer.service';
import { BeerDTO } from './dto/beer.dto';

@ApiTags('Beer')
@Controller('beer')
export class BeerController {
  constructor(private readonly beerService: BeerService) {}

  @ApiOperation({ summary: 'Get all beers list' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: BeerDTO,
    isArray: true,
  })
  @Get()
  async getAllBeers(
    @Query('sortOption') sortOption?: string,
  ): Promise<BeerDTO[]> {
    const entities = await this.beerService.getAllBeers(sortOption);
    return entities.map(entity => BeerDTO.fromEntity(entity));
  }

  @ApiResponse({ type: BeerDTO })
  @Get(':beerId')
  async getBeerById(@Param('id') id: string) {
    const entity = await this.beerService.getBeerInfo(id);
    return BeerDTO.fromEntity(entity);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiResponse({ type: BeerDTO })
  @ApiBody({ type: BeerDTO })
  @Post()
  async createBeer(@Body() beerData: Partial<BeerDTO>) {
    const validTypes = [
      ProductTypes.LAGER,
      ProductTypes.ALE,
      ProductTypes.WHEAT_BEER,
    ];
    if (
      !isEnum(beerData.type, ProductTypes) ||
      !validTypes.includes(beerData.type)
    ) {
      throw new BadRequestException(`Invalid beer type: ${beerData.type}`);
    }
    const entity = await this.beerService.createBeer(beerData);
    return BeerDTO.fromEntity(entity);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiResponse({ type: BeerDTO })
  @ApiBody({ type: BeerDTO })
  @Put(':id')
  async updateBeer(
    @Param('id') id: string,
    @Body() updateData: Partial<BeerDTO>,
  ) {
    const updatedBeer = await this.beerService.updateBeer(id, updateData);

    if (!updatedBeer) {
      throw new NotFoundException(`Beer with id ${id} not found`);
    }

    return BeerDTO.fromEntity(updatedBeer);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.CanManageProducts)
  @ApiResponse({ type: BeerDTO })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.beerService.archiveBeer(id);
  }
}
