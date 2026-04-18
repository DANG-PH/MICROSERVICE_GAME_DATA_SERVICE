import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { NpcSpawnEntity } from '../npc-spawn/npc-spawn.entity';

export enum LoaiNPC {
  NGUOI  = 'NGUOI',
  CAYDAU = 'CAYDAU',
  RUONGDO = 'RUONGDO',
  DUIGA  = 'DUIGA',
}

@Entity('npc_base')
export class NpcBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  ten: string;

  @Column({ type: 'enum', enum: LoaiNPC })
  loai: LoaiNPC;

  @OneToMany(() => NpcSpawnEntity, (spawn) => spawn.npcBase)
  spawns: NpcSpawnEntity[];
}