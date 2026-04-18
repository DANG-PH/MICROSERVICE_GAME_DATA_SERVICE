import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NpcSpawnService } from './npc-spawn.service';
import type {
  Empty,
  ThemNpcSpawnRequest,
  SuaNpcSpawnRequest,
  XoaNpcSpawnRequest,
  NpcSpawn,
} from '../../../proto/game-data.pb';

@Controller()
export class NpcSpawnController {
  constructor(private readonly npcSpawnService: NpcSpawnService) {}

  @GrpcMethod('GameDataService', 'ThemNpcSpawn')
  async themNpcSpawn(data: ThemNpcSpawnRequest): Promise<NpcSpawn> {
    return this.npcSpawnService.themNpcSpawn(data);
  }

  @GrpcMethod('GameDataService', 'SuaNpcSpawn')
  async suaNpcSpawn(data: SuaNpcSpawnRequest): Promise<NpcSpawn> {
    return this.npcSpawnService.suaNpcSpawn(data);
  }

  @GrpcMethod('GameDataService', 'XoaNpcSpawn')
  async xoaNpcSpawn(data: XoaNpcSpawnRequest): Promise<Empty> {
    return this.npcSpawnService.xoaNpcSpawn(data);
  }
}