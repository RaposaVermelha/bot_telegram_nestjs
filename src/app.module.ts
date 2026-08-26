import { Module } from '@nestjs/common';

import { TelegramModule } from './modules/telegram/telegram.module';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TelegramModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
