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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { isEnum } from 'class-validator';

import { ProductTypes } from 'shared/enums/productTypes.enum';

import { AccessoriesService } from './accessories.service';
import { AccessoryDTO } from './dto/accessory.dto';

@ApiTags('Accessory')
@Controller('accessory')
export class AccessoriesController {
  constructor(private readonly accessoriesService: AccessoriesService) {}

  @ApiOperation({ summary: 'Get all accessories list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: AccessoryDTO,
    isArray: true,
  })
  @Get()
  async getAllAccessories(): Promise<AccessoryDTO[]> {
    const entities = await this.accessoriesService.getAllAccessories();
    return entities.map(entity => AccessoryDTO.fromEntity(entity));
  }

  @Get(':accessoryId')
  async getAccessoryById(@Param('id') id: string) {
    const entity = await this.accessoriesService.getAccessoryInfo(id);
    return AccessoryDTO.fromEntity(entity);
  }
  @Post()
  async createAccessory(@Body() accessoryData: Partial<AccessoryDTO>) {
    const validTypes = [
      ProductTypes.BEER_GLASSES,
      ProductTypes.BOTTLE_OPENER,
      ProductTypes.BEER_COASTERS,
    ];
    if (
      !isEnum(accessoryData.type, ProductTypes) ||
      !validTypes.includes(accessoryData.type)
    ) {
      throw new BadRequestException(`Invalid beer type: ${accessoryData.type}`);
    }
    const entity = await this.accessoriesService.createAccessory(accessoryData);
    return AccessoryDTO.fromEntity(entity);
  }
  @Put(':id')
  async updateAccessory(
    @Param('id') id: string,
    @Body() updateData: Partial<AccessoryDTO>,
  ) {
    const updatedAccessory = await this.accessoriesService.updateAccessory(
      id,
      updateData,
    );

    if (!updatedAccessory) {
      throw new NotFoundException(`Accessory with id ${id} not found`);
    }

    return AccessoryDTO.fromEntity(updatedAccessory);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.accessoriesService.archiveAccessory(id);
  }
}
