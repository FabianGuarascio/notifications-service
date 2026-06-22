import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

export interface Notification {
  id: number;
  type: 'email' | 'sms' | 'push';
  recipient: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

@Injectable()
export class NotificationsService {
  private readonly store: Notification[] = [];
  private nextId = 1;

  create(dto: CreateNotificationDto): Notification {
    const notification: Notification = {
      id: this.nextId++,
      ...dto,
      read: false,
      createdAt: new Date(),
    };
    this.store.push(notification);
    return notification;
  }

  findAll(): Notification[] {
    return this.store;
  }

  findOne(id: number): Notification {
    const notification = this.store.find((n) => n.id === id);
    if (!notification) throw new NotFoundException(`Notification #${id} not found`);
    return notification;
  }

  update(id: number, dto: UpdateNotificationDto): Notification {
    const notification = this.findOne(id);
    Object.assign(notification, dto);
    return notification;
  }

  remove(id: number): void {
    const index = this.store.findIndex((n) => n.id === id);
    if (index === -1) throw new NotFoundException(`Notification #${id} not found`);
    this.store.splice(index, 1);
  }
}
