import { Module } from '@nestjs/common';

import { telegramBotProvider } from './infra/telegram.bot';

import { TelegramService } from './infra/telegram.service';

import { AuditoriaModule } from '../auditoria/auditoria.module';

import { ConsultaPotenciaModule } from '../consulta-potencia/consulta-potencia.module';

@Module({
  imports: [AuditoriaModule, ConsultaPotenciaModule],

  providers: [telegramBotProvider, TelegramService],

  exports: [telegramBotProvider],
})
export class TelegramModule {}
