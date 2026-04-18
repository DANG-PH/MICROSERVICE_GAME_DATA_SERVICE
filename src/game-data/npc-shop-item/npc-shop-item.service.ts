import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { NpcShopItemEntity } from './npc-shop-item.entity';
import {
  Empty,
  GetShopTheoNpcRequest,
  GetShopTheoNpcResponse,
  ThemShopItemRequest,
  SuaShopItemRequest,
  XoaShopItemRequest,
  NpcShopItem,
} from '../../../proto/game-data.pb';

@Injectable()
export class NpcShopItemService {
  constructor(
    @InjectRepository(NpcShopItemEntity)
    private readonly npcShopItemRepo: Repository<NpcShopItemEntity>,
  ) {}

  async getShopTheoNpc(data: GetShopTheoNpcRequest): Promise<GetShopTheoNpcResponse> {
    const items = await this.npcShopItemRepo.find({
      where: { npcBase: { id: data.npc_base_id }, is_active: true },
      relations: ['npcBase'],
      order: { id: 'ASC' },
    });

    return {
      items: items.map((i) => this.toProto(i)),
    };
  }

  async themShopItem(data: ThemShopItemRequest): Promise<NpcShopItem> {
    const saved = await this.npcShopItemRepo.save(
      this.npcShopItemRepo.create({
        npcBase:   { id: data.npc_base_id },
        tenItem:   data.tenItem,
        gia:       data.gia,
        loaiTien:  data.loaiTien as any,
        tab:       data.tab as any,
        is_active: data.is_active,
      }),
    );

    const withRelation = await this.npcShopItemRepo.findOne({
      where: { id: saved.id },
      relations: ['npcBase'],
    });

    return this.toProto(withRelation);
  }

  async suaShopItem(data: SuaShopItemRequest): Promise<NpcShopItem> {
    const item = await this.npcShopItemRepo.findOne({
      where: { id: data.id },
      relations: ['npcBase'],
    });

    if (!item) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `ShopItem id=${data.id} không tồn tại`,
      });
    }

    item.tenItem   = data.tenItem;
    item.gia       = data.gia;
    item.loaiTien  = data.loaiTien as any;
    item.tab       = data.tab as any;
    item.is_active = data.is_active;

    const saved = await this.npcShopItemRepo.save(item);
    return this.toProto(saved);
  }

  async xoaShopItem(data: XoaShopItemRequest): Promise<Empty> {
    const item = await this.npcShopItemRepo.findOne({
      where: { id: data.id },
      relations: ['npcBase'],
    });

    if (!item) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `ShopItem id=${data.id} không tồn tại`,
      });
    }

    await this.npcShopItemRepo.remove(item);
    return {};
  }

  private toProto(item: NpcShopItemEntity): NpcShopItem {
    return {
      id:          item.id,
      npc_base_id: item.npcBase.id,
      ten_npc:     item.npcBase.ten,
      tenItem:     item.tenItem,
      gia:         item.gia,
      loaiTien:    item.loaiTien,
      tab:         item.tab,
      is_active:   item.is_active,
    };
  }
}