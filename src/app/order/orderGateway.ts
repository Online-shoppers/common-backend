import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { OrderEntity } from './entities/order.entity';

@WebSocketGateway()
export class OrderGateway {
  @WebSocketServer()
  server: Server;

  @UseGuards()
  @SubscribeMessage('updateOrderStatus')
  updateOrderStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: OrderEntity,
  ) {
    this.server.emit('statusUpdated', {
      orderId: data.id,
      orderStatus: data.status,
    });
  }
}
