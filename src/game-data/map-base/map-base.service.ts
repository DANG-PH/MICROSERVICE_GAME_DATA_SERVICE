import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { MapBaseEntity } from './map-base.entity';
import {
  Empty,
  GetAllMapResponse,
  ThemMapRequest,
  SuaMapRequest,
  XoaMapRequest,
  MapBase,
  GetNpcTheoMapRequest,
  GetNpcTheoMapResponse,
  NpcSpawn,
} from '../../../proto/game-data.pb';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(MapBaseEntity)
    private readonly mapRepo: Repository<MapBaseEntity>,
  ) {}

  async getAllMap(): Promise<GetAllMapResponse> {
    const maps = await this.mapRepo.find();
    return {
      maps: maps.map((m) => ({ id: m.id, ten: m.ten })),
    };
  }

  async themMap(data: ThemMapRequest): Promise<MapBase> {
    const existed = await this.mapRepo.findOneBy({ ten: data.ten });
    if (existed) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: `Map "${data.ten}" đã tồn tại`,
      });
    }

    const saved = await this.mapRepo.save(this.mapRepo.create({ ten: data.ten }));
    return { id: saved.id, ten: saved.ten };
  }

  async suaMap(data: SuaMapRequest): Promise<MapBase> {
    const map = await this.mapRepo.findOneBy({ id: data.id });
    if (!map) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `Map id=${data.id} không tồn tại`,
      });
    }

    map.ten = data.ten;
    const saved = await this.mapRepo.save(map);
    return { id: saved.id, ten: saved.ten };
  }

  async xoaMap(data: XoaMapRequest): Promise<Empty> {
    const map = await this.mapRepo.findOneBy({ id: data.id });
    if (!map) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `Map id=${data.id} không tồn tại`,
      });
    }

    await this.mapRepo.remove(map);
    return {};
  }

  async getNpcTheoMap(data: GetNpcTheoMapRequest): Promise<GetNpcTheoMapResponse> {
    const map = await this.mapRepo.findOne({
      where: { id: data.map_id },
      relations: { npcSpawns: { npcBase: true } },
    });
    if (!map) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `Map id=${data.map_id} không tồn tại`,
      });
    }

    const npcs: NpcSpawn[] = map.npcSpawns.map((spawn) => ({
      id:          spawn.id,
      npc_base_id: spawn.npcBase.id,
      ten_npc:     spawn.npcBase.ten,
      loai_npc:    spawn.npcBase.loai,
      map_id:      map.id,
      ten_map:     map.ten,
      x:           spawn.x,
      y:           spawn.y,
      is_active:   spawn.is_active,
    }));

    return { npcs };
  }
}