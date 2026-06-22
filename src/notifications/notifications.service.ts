import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
  ) {}

  create(dto: CreateNotificationDto): Promise<Notification> {
    const notification = this.repo.create({ ...dto, read: false });
    return this.repo.save(notification);
  }

  findAll(): Promise<Notification[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Notification> {
    const notification = await this.repo.findOneBy({ id });
    if (!notification) throw new NotFoundException(`Notification #${id} not found`);
    return notification;
  }

  async update(id: number, dto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.findOne(id);
    Object.assign(notification, dto);
    return this.repo.save(notification);
  }

  async remove(id: number): Promise<void> {
    const notification = await this.findOne(id);
    await this.repo.remove(notification);
  }
}
