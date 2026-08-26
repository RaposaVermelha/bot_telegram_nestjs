import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditoriaService {
  async iniciar(ctx: any) {
    await ctx.reply(
      `
📸 Auditoria iniciada!

Envie a foto da traseira da ONU.
      `,
    );
  }

  async processarImagem(ctx: any) {
    await ctx.reply('📸 Imagem recebida! Vou analisar...');
  }
}
