import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

import { PythonVisionService } from '../../infra/services/python-vision.service';

@Injectable()
export class ProcessarImagemUseCase {
  constructor(private readonly pythonVision: PythonVisionService) {}

  async execute(ctx: Context): Promise<void> {
    const chatId = ctx.chat?.id;

    if (!chatId) {
      return;
    }

    await ctx.reply('📸 Imagem recebida!\n\n⏳ Analisando...');

    const resultado = await this.pythonVision.analisar(ctx);

    console.log('Resultado Python:', resultado);

    /*
     * Por enquanto vamos apenas testar
     * a resposta do Python.
     */

    await ctx.reply(`🤖 Resultado:\n${JSON.stringify(resultado, null, 2)}`);
  }
}
