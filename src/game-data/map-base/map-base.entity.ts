import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { NpcSpawnEntity } from '../npc-spawn/npc-spawn.entity';

@Entity('map_base')
export class MapBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  ten: string;

  @OneToMany(() => NpcSpawnEntity, (spawn) => spawn.map)
  npcSpawns: NpcSpawnEntity[];
}