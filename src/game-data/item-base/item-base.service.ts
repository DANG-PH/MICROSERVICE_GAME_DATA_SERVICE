import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { ItemBaseEntity } from './item-base.entity';
import type {
  Empty,
  GetAllItemBaseResponse,
  ThemItemBaseRequest,
  ThemItemBaseResponse,
  SuaItemBaseRequest,
  SuaItemBaseResponse,
  XoaItemBaseRequest,
} from '../../../proto/game-data.pb';

@Injectable()
export class ItemBaseService {
  constructor(
    @InjectRepository(ItemBaseEntity)
    private readonly itemBaseRepo: Repository<ItemBaseEntity>,
  ) {}

  async getAllItemBase(): Promise<GetAllItemBaseResponse> {
    const items = await this.itemBaseRepo.find({ order: { id: 'ASC' } });
    return {
      items: items.map((i) => this.toProto(i)),
    };
  }

  async themItemBase(data: ThemItemBaseRequest): Promise<ThemItemBaseResponse> {
    const existedTen = await this.itemBaseRepo.findOneBy({ ten: data.ten });
    if (existedTen) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: `Item tên "${data.ten}" đã tồn tại`,
      });
    }

    const existedMa = await this.itemBaseRepo.findOneBy({ ma: data.ma });
    if (existedMa) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: `Item mã "${data.ma}" đã tồn tại`,
      });
    }

    const saved = await this.itemBaseRepo.save(
      this.itemBaseRepo.create({ ten: data.ten, ma: data.ma }),
    );

    return { item: this.toProto(saved) };
  }

  async suaItemBase(data: SuaItemBaseRequest): Promise<SuaItemBaseResponse> {
    const item = await this.itemBaseRepo.findOneBy({ id: data.id });
    if (!item) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `ItemBase id=${data.id} không tồn tại`,
      });
    }

    item.ten = data.ten;
    item.ma  = data.ma;
    const saved = await this.itemBaseRepo.save(item);
    return { item: this.toProto(saved) };
  }

  async xoaItemBase(data: XoaItemBaseRequest): Promise<Empty> {
    const item = await this.itemBaseRepo.findOneBy({ id: data.id });
    if (!item) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `ItemBase id=${data.id} không tồn tại`,
      });
    }

    await this.itemBaseRepo.remove(item);
    return {};
  }

  private toProto(item: ItemBaseEntity) {
    return {
      id:  item.id,
      ten: item.ten,
      ma:  item.ma,
    };
  }
}