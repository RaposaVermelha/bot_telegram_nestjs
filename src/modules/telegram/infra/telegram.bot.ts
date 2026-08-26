import { Telegraf } from 'telegraf';

export const TELEGRAM_BOT = 'TELEGRAM_BOT';

export const telegramBotProvider = {
  provide: TELEGRAM_BOT,

  useFactory: () => {
    const token = process.env.BOT_TOKEN;

    if (!token) {
      throw new Error('BOT_TOKEN não configurado.');
    }

    return new Telegraf(token, {
      handlerTimeout: 1200000,
    });
  },
};
