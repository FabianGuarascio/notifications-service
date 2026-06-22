export class CreateNotificationDto {
  type!: 'email' | 'sms' | 'push';
  recipient!: string;
  message!: string;
}
