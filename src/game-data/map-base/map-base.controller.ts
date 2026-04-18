import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { MapService } from './map-base.service';
import type {
  Empty,
  GetAllMapResponse,
  ThemMapRequest,
  SuaMapRequest,
  XoaMapRequest,
  MapBase,
  GetNpcTheoMapRequest,
  GetNpcTheoMapResponse,
} from '../../../proto/game-data.pb';

@Controller()
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @GrpcMethod('GameDataService', 'GetAllMap')
  async getAllMap(_data: Empty): Promise<GetAllMapResponse> {
    return this.mapService.getAllMap();
  }

  @GrpcMethod('GameDataService', 'ThemMap')
  async themMap(data: ThemMapRequest): Promise<MapBase> {
    return this.mapService.themMap(data);
  }

  @GrpcMethod('GameDataService', 'SuaMap')
  async suaMap(data: SuaMapRequest): Promise<MapBase> {
    return this.mapService.suaMap(data);
  }

  @GrpcMethod('GameDataService', 'XoaMap')
  async xoaMap(data: XoaMapRequest): Promise<Empty> {
    return this.mapService.xoaMap(data);
  }

  // Query "map này chứa những NPC nào" => subject là map => đặt ở đây
  @GrpcMethod('GameDataService', 'GetNpcTheoMap')
  async getNpcTheoMap(data: GetNpcTheoMapRequest): Promise<GetNpcTheoMapResponse> {
    return this.mapService.getNpcTheoMap(data);
  }
}