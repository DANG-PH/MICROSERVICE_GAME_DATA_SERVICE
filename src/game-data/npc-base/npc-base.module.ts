import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NpcBaseEntity } from './npc-base.entity';
import { NpcBaseController } from './npc-base.controller';
import { NpcBaseService } from './npc-base.service';

@Module({
  imports: [TypeOrmModule.forFeature([NpcBaseEntity])], 
  providers: [NpcBaseService],
  controllers: [NpcBaseController],
  exports: [NpcBaseService], 
})
export class NpcBaseModule {}