import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

export enum MusicStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('music')
export class MusicEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  fileUrl: string;

  @Column()
  hash: string;

  @Column({ type: 'enum', enum: MusicStatus, default: MusicStatus.ACTIVE })
  status: MusicStatus;
}