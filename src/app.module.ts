import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { NpcBaseModule } from './game-data/npc-base/npc-base.module';
import { NpcSpawnModule } from './game-data/npc-spawn/npc-spawn.module';
import { MapBaseModule } from './game-data/map-base/map-base.module';
import { NpcShopItemModule } from './game-data/npc-shop-item/npc-shop-item.module';
import { ItemBaseModule } from './game-data/item-base/item-base.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,           
      envFilePath: '.env',     
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
    }),
    NpcBaseModule,
    NpcSpawnModule,
    MapBaseModule,
    NpcShopItemModule,
    ItemBaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
