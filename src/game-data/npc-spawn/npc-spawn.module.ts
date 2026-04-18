import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NpcSpawnEntity } from './npc-spawn.entity';
import { NpcSpawnService } from './npc-spawn.service';
import { NpcSpawnController } from './npc-spawn.controller';
import { MapBaseModule } from '../map-base/map-base.module';
import { NpcBaseModule } from '../npc-base/npc-base.module';
import { NpcBaseEntity } from '../npc-base/npc-base.entity';
import { MapBaseEntity } from '../map-base/map-base.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NpcSpawnEntity, MapBaseEntity, NpcBaseEntity, ]), MapBaseModule, NpcBaseModule], 
  providers: [NpcSpawnService],
  controllers: [NpcSpawnController],
  exports: [NpcSpawnService], 
})
export class NpcSpawnModule {}