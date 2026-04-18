import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NpcShopItemEntity } from './npc-shop-item.entity';
import { NpcShopItemController } from './npc-shop-item.controller';
import { NpcShopItemService } from './npc-shop-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([NpcShopItemEntity])],
  providers: [NpcShopItemService],
  controllers: [NpcShopItemController],
  exports: [NpcShopItemService],
})
export class NpcShopItemModule {}