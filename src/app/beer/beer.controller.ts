import { Controller, Delete, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { BeerService } from './beer.service';
import { BeerDTO } from './dto/Beer.dto';

@Controller('beer')
export class BeerController {
  constructor(private readonly beerService: BeerService) {}

  @ApiOperation({ summary: 'Get all users list' })
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
  async getBeerById(@Param('id') id: number) {
    const entity = await this.beerService.getBeerInfo(id);
    return BeerDTO.fromEntity(entity);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.beerService.archiveUser(id);
  }
}
