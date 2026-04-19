import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemBaseEntity } from './item-base.entity';
import { ItemBaseController } from './item-base.controller';
import { ItemBaseService } from './item-base.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemBaseEntity])],
  providers: [ItemBaseService],
  controllers: [ItemBaseController],
  exports: [ItemBaseService],
})
export class ItemBaseModule {}