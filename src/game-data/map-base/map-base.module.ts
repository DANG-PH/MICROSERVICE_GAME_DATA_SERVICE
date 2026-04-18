import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapBaseEntity } from './map-base.entity';
import { MapService } from './map-base.service';
import { MapController } from './map-base.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MapBaseEntity])], 
  providers: [MapService],
  controllers: [MapController],
  exports: [MapService], 
})
export class MapBaseModule {}