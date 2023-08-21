import {
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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SnacksDTO } from './dto/snack.dto';
import { SnacksService } from './snacks.service';

@Controller('snacks')
export class SnacksController {
  constructor(private readonly snacksService: SnacksService) {}

  @ApiOperation({ summary: 'Get all snacks list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: SnacksDTO,
    isArray: true,
  })
  @Get()
  async getAllSnacks(): Promise<SnacksDTO[]> {
    const entities = await this.snacksService.getAllSnacks();
    return entities.map(entity => SnacksDTO.fromEntity(entity));
  }

  @Get(':snacksId')
  async getSnacksById(@Param('id') id: string) {
    const entity = await this.snacksService.getSnacksInfo(id);
    return SnacksDTO.fromEntity(entity);
  }
  @Post()
  async createSnacks(@Body() snacksData: Partial<SnacksDTO>) {
    const entity = await this.snacksService.createSnacks(snacksData);
    return SnacksDTO.fromEntity(entity);
  }
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

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.snacksService.archiveSnacks(id);
  }
}
