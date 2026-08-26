import { Telegraf } from 'telegraf';

import { AuditoriaService } from '../../../auditoria/application/auditoria.service';

import { ConsultaPotenciaService } from '../../../consulta-potencia/application/consulta-potencia.service';

export function registerTextHandler(
  bot: Telegraf,
  auditoria: AuditoriaService,
  consultaPotencia: ConsultaPotenciaService,
) {
  bot.on('text', async (ctx) => {
    const texto = ctx.message.text.trim();

    /*
    -------------------------
    MENU
    -------------------------
    */

    if (texto === '1') {
      return consultaPotencia.iniciar(ctx);
    }

    if (texto === '2') {
      return auditoria.iniciar(ctx);
    }

    /*
    -------------------------
    OUTROS TEXTOS
    -------------------------
    */

    await ctx.reply('❌ Opção inválida.\n\nDigite 1 ou 2.');
  });
}
