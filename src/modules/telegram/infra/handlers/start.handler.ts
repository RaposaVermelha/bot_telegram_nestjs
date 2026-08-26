import { Telegraf } from 'telegraf';

export function registerStartHandler(bot: Telegraf) {
  bot.start(async (ctx) => {
    await ctx.reply(
      `
🚀 AmzAuditex

1 - Consultar potência

2 - Auditoria

Digite a opção.
      `,
    );
  });
}
