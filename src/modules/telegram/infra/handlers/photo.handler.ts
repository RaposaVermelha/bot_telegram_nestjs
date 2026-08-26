import { Telegraf } from 'telegraf';

import { AuditoriaService } from '../../../auditoria/application/auditoria.service';

export function registerPhotoHandler(
  bot: Telegraf,
  auditoria: AuditoriaService,
) {
  bot.on('photo', async (ctx) => {
    await auditoria.processarImagem(ctx);
  });
}
