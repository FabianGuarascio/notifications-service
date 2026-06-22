import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @MessagePattern('createNotification')
  create(@Payload() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  @MessagePattern('findAllNotifications')
  findAll() {
    return this.notificationsService.findAll();
  }

  @MessagePattern('findOneNotification')
  findOne(@Payload() id: number) {
    return this.notificationsService.findOne(id);
  }

  @MessagePattern('updateNotification')
  update(@Payload() payload: { id: number; dto: UpdateNotificationDto }) {
    return this.notificationsService.update(payload.id, payload.dto);
  }

  @MessagePattern('removeNotification')
  remove(@Payload() id: number) {
    return this.notificationsService.remove(id);
  }
}
