import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { NpcBaseEntity } from './npc-base.entity';
import {
  Empty,
  GetAllNpcBaseResponse,
  ThemNpcBaseRequest,
  SuaNpcBaseRequest,
  XoaNpcBaseRequest,
  NpcBase,
} from '../../../proto/game-data.pb';

@Injectable()
export class NpcBaseService {
  constructor(
    @InjectRepository(NpcBaseEntity)
    private readonly npcBaseRepo: Repository<NpcBaseEntity>,
  ) {}

  async getAllNpcBase(): Promise<GetAllNpcBaseResponse> {
    const npcs = await this.npcBaseRepo.find();
    return {
      npcs: npcs.map((n) => ({ id: n.id, ten: n.ten, loai: n.loai })),
    };
  }

  async themNpcBase(data: ThemNpcBaseRequest): Promise<NpcBase> {
    const existed = await this.npcBaseRepo.findOneBy({ ten: data.ten });
    if (existed) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: `NPC "${data.ten}" đã tồn tại`,
      });
    }

    const saved = await this.npcBaseRepo.save(
      this.npcBaseRepo.create({ ten: data.ten, loai: data.loai as any }),
    );
    return { id: saved.id, ten: saved.ten, loai: saved.loai };
  }

  async suaNpcBase(data: SuaNpcBaseRequest): Promise<NpcBase> {
    const npc = await this.npcBaseRepo.findOneBy({ id: data.id });
    if (!npc) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `NpcBase id=${data.id} không tồn tại`,
      });
    }

    npc.ten  = data.ten;
    npc.loai = data.loai as any;
    const saved = await this.npcBaseRepo.save(npc);
    return { id: saved.id, ten: saved.ten, loai: saved.loai };
  }

  async xoaNpcBase(data: XoaNpcBaseRequest): Promise<Empty> {
    const npc = await this.npcBaseRepo.findOneBy({ id: data.id });
    if (!npc) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `NpcBase id=${data.id} không tồn tại`,
      });
    }

    await this.npcBaseRepo.remove(npc);
    return {};
  }
}