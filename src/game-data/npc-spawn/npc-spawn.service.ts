import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { NpcSpawnEntity } from './npc-spawn.entity';
import { MapBaseEntity } from '../map-base/map-base.entity';
import { NpcBaseEntity } from '../npc-base/npc-base.entity';
import {
  Empty,
  ThemNpcSpawnRequest,
  SuaNpcSpawnRequest,
  XoaNpcSpawnRequest,
  NpcSpawn,
} from '../../../proto/game-data.pb';

@Injectable()
export class NpcSpawnService {
  constructor(
    @InjectRepository(NpcSpawnEntity)
    private readonly spawnRepo: Repository<NpcSpawnEntity>,

    @InjectRepository(MapBaseEntity)
    private readonly mapRepo: Repository<MapBaseEntity>,

    @InjectRepository(NpcBaseEntity)
    private readonly npcBaseRepo: Repository<NpcBaseEntity>,
  ) {}

  async themNpcSpawn(data: ThemNpcSpawnRequest): Promise<NpcSpawn> {
    const [npcBase, map] = await Promise.all([
      this.npcBaseRepo.findOneBy({ id: data.npc_base_id }),
      this.mapRepo.findOneBy({ id: data.map_id }),
    ]);

    if (!npcBase) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `NpcBase id=${data.npc_base_id} không tồn tại`,
      });
    }
    if (!map) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `Map id=${data.map_id} không tồn tại`,
      });
    }

    const saved = await this.spawnRepo.save(
      this.spawnRepo.create({
        npcBase,
        map,
        x:         data.x,
        y:         data.y,
        is_active: data.is_active,
      }),
    );

    return this.toProto(saved, npcBase, map);
  }

  async suaNpcSpawn(data: SuaNpcSpawnRequest): Promise<NpcSpawn> {
    const spawn = await this.spawnRepo.findOne({
      where: { id: data.id },
      relations: { npcBase: true, map: true },
    });
    if (!spawn) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `NpcSpawn id=${data.id} không tồn tại`,
      });
    }

    if (data.map_id !== spawn.map.id) {
      const newMap = await this.mapRepo.findOneBy({ id: data.map_id });
      if (!newMap) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: `Map id=${data.map_id} không tồn tại`,
        });
      }
      spawn.map = newMap;
    }

    spawn.x         = data.x;
    spawn.y         = data.y;
    spawn.is_active = data.is_active;

    const saved = await this.spawnRepo.save(spawn);
    return this.toProto(saved, saved.npcBase, saved.map);
  }

  async xoaNpcSpawn(data: XoaNpcSpawnRequest): Promise<Empty> {
    const spawn = await this.spawnRepo.findOneBy({ id: data.id });
    if (!spawn) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `NpcSpawn id=${data.id} không tồn tại`,
      });
    }

    await this.spawnRepo.remove(spawn);
    return {};
  }

  // ---------------------------------------------------------------
  private toProto(
    spawn: NpcSpawnEntity,
    npcBase: NpcBaseEntity,
    map: MapBaseEntity,
  ): NpcSpawn {
    return {
      id:          spawn.id,
      npc_base_id: npcBase.id,
      ten_npc:     npcBase.ten,
      loai_npc:    npcBase.loai,
      map_id:      map.id,
      ten_map:     map.ten,
      x:           spawn.x,
      y:           spawn.y,
      is_active:   spawn.is_active,
    };
  }
}