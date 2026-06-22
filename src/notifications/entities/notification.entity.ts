import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: string;

  @Column()
  recipient!: string;

  @Column()
  message!: string;

  @Column({ default: false })
  read: boolean = false;

  @CreateDateColumn()
  createdAt!: Date;
}
