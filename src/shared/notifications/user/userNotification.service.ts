import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { UserEvent } from './user.event';

@Injectable()
export class NotificationsService {
  @OnEvent('new.user')
  async notifyNew(payload: UserEvent) {
    console.log(`New user ${payload.name} has been just created!`);
  }

  @OnEvent('delete.user')
  async notifyDeleted(payload: UserEvent) {
    console.log(`User ${payload.name} has been just deleted!`);
  }
}
