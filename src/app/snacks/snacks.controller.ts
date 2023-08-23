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
} from '@nestjs/common';


import { isEnum } from 'class-validator';

import { ProductTypes } from 'shared/enums/productTypes.enum';

import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';



import { SnacksDTO } from './dto/snack.dto';
import { SnacksService } from './snacks.service';


@ApiTags('Snack')

@Controller('snacks')
export class SnacksController {
  constructor(private readonly snacksService: SnacksService) {}

  @ApiOperation({ summary: 'Get all snacks list' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SnacksDTO,
    isArray: true,
  })
  @Get()
  async getAllSnacks(): Promise<SnacksDTO[]> {
    const entities = await this.snacksService.getAllSnacks();
    return entities.map(entity => SnacksDTO.fromEntity(entity));
  }

  @Get(':snacksId')
  @ApiResponse({ type: SnacksDTO })
  async getSnacksById(@Param('id') id: string) {
    const entity = await this.snacksService.getSnacksInfo(id);
    return SnacksDTO.fromEntity(entity);
  }

  @ApiBody({ type: SnacksDTO })
  @ApiResponse({ type: SnacksDTO })
  @Post()
  async createSnacks(@Body() snacksData: Partial<SnacksDTO>) {
    const validTypes = [
      ProductTypes.PRETZELS,
      ProductTypes.NACHOS,
      ProductTypes.SPICY_WINGS,
    ];
    if (
      !isEnum(snacksData.type, ProductTypes) ||
      !validTypes.includes(snacksData.type)
    ) {
      throw new BadRequestException(`Invalid beer type: ${snacksData.type}`);
    }
    const entity = await this.snacksService.createSnacks(snacksData);
    return SnacksDTO.fromEntity(entity);
  }

  @ApiBody({ type: SnacksDTO })
  @ApiResponse({ type: SnacksDTO })
  @Put(':id')
  async updatedSnacks(
    @Param('id') id: string,
    @Body() updateData: Partial<SnacksDTO>,
  ) {
    const updatedSnacks = await this.snacksService.updateSnacks(id, updateData);

    if (!updatedSnacks) {
      throw new NotFoundException(`Snacks with id ${id} not found`);
    }

    return SnacksDTO.fromEntity(updatedSnacks);
  }

  @ApiResponse({ type: SnacksDTO })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.snacksService.archiveSnacks(id);
  }
}
