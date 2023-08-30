import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from 'app/security/decorators/current-user.decorator';
import { UserSessionDto } from 'app/security/dto/user-session.dto';

import { NewOrderForm } from './dto/new-order.form';
import { OrderDTO } from './dto/order.dto';
import { OrderStatuses } from './enums/order-statuses.enum';
import { OrderService } from './order.service';
import { OrderGateway } from './orderGateway';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderGateway: OrderGateway,
  ) {}

  @ApiResponse({ type: OrderDTO, isArray: true })
  @Get()
  async findUserOrders(@CurrentUser() user: UserSessionDto) {
    const entities = await this.orderService.findUserOrders(user.id);
    return OrderDTO.fromEntities(entities);
  }

  @ApiBody({ type: NewOrderForm })
  @Post()
  async create(
    @Body() orderForm: NewOrderForm,
    @CurrentUser() user: UserSessionDto,
  ) {
    const dto = await this.orderService.createOrder(user.id, orderForm);
    return OrderDTO.fromEntity(dto);
  }

  @ApiResponse({ type: OrderDTO })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const entity = await this.orderService.findOne(id);
    return OrderDTO.fromEntity(entity);
  }

  @ApiResponse({ type: OrderDTO })
  @Put(':id')
  async update(@Param('id') orderId: string, @Body() status: OrderStatuses) {
    const updated = await this.orderService.update(orderId, status);
    this.orderGateway.server.emit('updateOrderStatus', updated);
    return OrderDTO.fromEntity(updated);
  }

  // @ApiResponse({ type: Number })
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.orderService.remove(id);
  // }
}
