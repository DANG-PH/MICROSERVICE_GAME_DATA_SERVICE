// npc-spawn.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MapBaseEntity } from '../map-base/map-base.entity';
import { NpcBaseEntity } from '../npc-base/npc-base.entity';

@Entity('npc_spawn')
export class NpcSpawnEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => NpcBaseEntity, (npcBase) => npcBase.spawns, { eager: false })
  @JoinColumn({ name: 'npc_base_id' })
  npcBase: NpcBaseEntity;

  @ManyToOne(() => MapBaseEntity, (map) => map.npcSpawns, { eager: false })
  @JoinColumn({ name: 'map_id' })
  map: MapBaseEntity;

  @Column({ type: 'float' })
  x: number;

  @Column({ type: 'float' })
  y: number;

  @Column({ default: true })
  is_active: boolean;
}