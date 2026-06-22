import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller()
export class NotificationsController implements OnModuleInit {
  constructor(
    private readonly notificationsService: NotificationsService,
    @Inject('KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  private async safe<T>(
    pattern: string,
    payload: unknown,
    fn: () => Promise<T>,
  ): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      this.kafkaClient.emit('notifications.error', {
        pattern,
        payload,
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
      });
      throw err;
    }
  }

  @MessagePattern('createNotification')
  create(@Payload() dto: CreateNotificationDto) {
    return this.safe('createNotification', dto, () =>
      this.notificationsService.create(dto),
    );
  }

  @MessagePattern('findAllNotifications')
  findAll() {
    return this.safe('findAllNotifications', {}, () =>
      this.notificationsService.findAll(),
    );
  }

  @MessagePattern('findOneNotification')
  findOne(@Payload() id: number) {
    return this.safe('findOneNotification', id, () =>
      this.notificationsService.findOne(+id),
    );
  }

  @MessagePattern('updateNotification')
  update(@Payload() payload: { id: number; dto: UpdateNotificationDto }) {
    return this.safe('updateNotification', payload, () =>
      this.notificationsService.update(payload.id, payload.dto),
    );
  }

  @MessagePattern('removeNotification')
  remove(@Payload() id: number) {
    return this.safe('removeNotification', id, () =>
      this.notificationsService.remove(+id),
    );
  }

  @EventPattern('movie.created')
  handleMovieCreated(@Payload() movie: { id: number; title: string }) {
    return this.safe('movie.created', movie, () =>
      this.notificationsService.create({
        type: 'push',
        recipient: 'all',
        message: `New movie added: ${movie.title}`,
      }),
    );
  }

  @EventPattern('rating.added')
  handleRatingAdded(@Payload() data: { movieId: number; score: number }) {
    return this.safe('rating.added', data, () =>
      this.notificationsService.create({
        type: 'push',
        recipient: 'all',
        message: `New rating ${data.score} added for movie #${data.movieId}`,
      }),
    );
  }
}
