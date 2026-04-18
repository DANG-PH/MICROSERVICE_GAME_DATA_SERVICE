import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NpcBaseService } from './npc-base.service';
import type {
  Empty,
  GetAllNpcBaseResponse,
  ThemNpcBaseRequest,
  SuaNpcBaseRequest,
  XoaNpcBaseRequest,
  NpcBase,
} from '../../../proto/game-data.pb';

@Controller()
export class NpcBaseController {
  constructor(private readonly npcBaseService: NpcBaseService) {}

  @GrpcMethod('GameDataService', 'GetAllNpcBase')
  async getAllNpcBase(_data: Empty): Promise<GetAllNpcBaseResponse> {
    return this.npcBaseService.getAllNpcBase();
  }

  @GrpcMethod('GameDataService', 'ThemNpcBase')
  async themNpcBase(data: ThemNpcBaseRequest): Promise<NpcBase> {
    return this.npcBaseService.themNpcBase(data);
  }

  @GrpcMethod('GameDataService', 'SuaNpcBase')
  async suaNpcBase(data: SuaNpcBaseRequest): Promise<NpcBase> {
    return this.npcBaseService.suaNpcBase(data);
  }

  @GrpcMethod('GameDataService', 'XoaNpcBase')
  async xoaNpcBase(data: XoaNpcBaseRequest): Promise<Empty> {
    return this.npcBaseService.xoaNpcBase(data);
  }
}