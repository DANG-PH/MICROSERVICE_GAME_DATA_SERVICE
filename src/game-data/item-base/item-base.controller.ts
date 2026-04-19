import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ItemBaseService } from './item-base.service';
import type {
  GetAllItemBaseRequest,
  GetAllItemBaseResponse,
  ThemItemBaseRequest,
  ThemItemBaseResponse,
  SuaItemBaseRequest,
  SuaItemBaseResponse,
  XoaItemBaseRequest,
  Empty,
} from '../../../proto/game-data.pb';

@Controller()
export class ItemBaseController {
  constructor(private readonly itemBaseService: ItemBaseService) {}

  @GrpcMethod('GameDataService', 'GetAllItemBase')
  async getAllItemBase(_data: GetAllItemBaseRequest): Promise<GetAllItemBaseResponse> {
    return this.itemBaseService.getAllItemBase();
  }

  @GrpcMethod('GameDataService', 'ThemItemBase')
  async themItemBase(data: ThemItemBaseRequest): Promise<ThemItemBaseResponse> {
    return this.itemBaseService.themItemBase(data);
  }

  @GrpcMethod('GameDataService', 'SuaItemBase')
  async suaItemBase(data: SuaItemBaseRequest): Promise<SuaItemBaseResponse> {
    return this.itemBaseService.suaItemBase(data);
  }

  @GrpcMethod('GameDataService', 'XoaItemBase')
  async xoaItemBase(data: XoaItemBaseRequest): Promise<Empty> {
    return this.itemBaseService.xoaItemBase(data);
  }
}