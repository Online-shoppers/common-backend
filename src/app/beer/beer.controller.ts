import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { BeerService } from './beer.service';
import { BeerDTO } from './dto/beer.dto';

@Controller('beer')
export class BeerController {
  constructor(private readonly beerService: BeerService) {}

  @ApiOperation({ summary: 'Get all beers list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: BeerDTO,
    isArray: true,
  })
  @Get()
  async getAllBeers(): Promise<BeerDTO[]> {
    const entities = await this.beerService.getAllBeers();
    return entities.map(entity => BeerDTO.fromEntity(entity));
  }

  @Get(':beerId')
  async getBeerById(@Param('id') id: string) {
    const entity = await this.beerService.getBeerInfo(id);
    return BeerDTO.fromEntity(entity);
  }
  @Post()
  async createBeer(@Body() beerData: Partial<BeerDTO>) {
    const entity = await this.beerService.createBeer(beerData);
    return BeerDTO.fromEntity(entity);
  }
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

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.beerService.archiveBeer(id);
  }
}
