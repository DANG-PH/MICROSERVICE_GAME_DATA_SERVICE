import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { NpcShopItemEntity } from '../npc-shop-item/npc-shop-item.entity';

@Entity('item_base')
export class ItemBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  ten: string;  // "Bông tai Porata" — key khớp với TEN_TO_INFO client

  @Column({ unique: true, length: 50 })
  ma: string;   // "bongtaic1" — mã định danh

  @OneToMany(() => NpcShopItemEntity, (shop) => shop.itemBase)
  shopItems: NpcShopItemEntity[];
}