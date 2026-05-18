// music.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { MusicService } from './music.service';
import type {
  Empty,
  GetAllMusicResponse,
  ThemMusicRequest,
  SuaMusicRequest,
  XoaMusicRequest,
  Music,
} from '../../../proto/game-data.pb';

@Controller()
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @GrpcMethod('GameDataService', 'GetAllMusic')
  async getAllMusic(_data: Empty): Promise<GetAllMusicResponse> {
    return this.musicService.getAllMusic();
  }

  @GrpcMethod('GameDataService', 'ThemMusic')
  async themMusic(data: ThemMusicRequest): Promise<Music> {
    return this.musicService.themMusic(data);
  }

  @GrpcMethod('GameDataService', 'SuaMusic')
  async suaMusic(data: SuaMusicRequest): Promise<Music> {
    return this.musicService.suaMusic(data);
  }

  @GrpcMethod('GameDataService', 'XoaMusic')
  async xoaMusic(data: XoaMusicRequest): Promise<Empty> {
    return this.musicService.xoaMusic(data);
  }
}