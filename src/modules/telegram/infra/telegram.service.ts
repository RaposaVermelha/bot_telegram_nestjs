import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { Telegraf } from 'telegraf';

import { TELEGRAM_BOT } from './telegram.bot';

import { registerStartHandler } from './handlers/start.handler';

import { registerTextHandler } from './handlers/text.handler';

import { registerPhotoHandler } from './handlers/photo.handler';

import { AuditoriaService } from '../../auditoria/application/auditoria.service';

import { ConsultaPotenciaService } from '../../consulta-potencia/application/consulta-potencia.service';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(TELEGRAM_BOT)
    private readonly bot: Telegraf,

    private readonly auditoria: AuditoriaService,

    private readonly consultaPotencia: ConsultaPotenciaService,
  ) {}

  async onModuleInit() {
    registerStartHandler(this.bot);

    registerTextHandler(this.bot, this.auditoria, this.consultaPotencia);

    registerPhotoHandler(this.bot, this.auditoria);

    await this.bot.launch();

    console.log('Telegram online ✅');
  }

  onModuleDestroy() {
    this.bot.stop('NestJS shutdown');
  }
}
