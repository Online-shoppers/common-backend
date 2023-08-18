import { Controller, Delete, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SnacksDTO } from './dto/snack.dto';
import { SnacksService } from './snacks.service';

@Controller('snacks')
export class SnacksController {
  constructor(private readonly snacksService: SnacksService) {}

  @ApiOperation({ summary: 'Get all users list' })
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

  @Get(':snackId')
  async getSnackById(@Param('id') id: string) {
    const entity = await this.snacksService.getSnackInfo(id);
    return SnacksDTO.fromEntity(entity);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.snacksService.archiveSnack(id);
  }
}
