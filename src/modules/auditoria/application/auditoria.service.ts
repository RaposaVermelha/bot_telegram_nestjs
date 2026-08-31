import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

import { ProcessarImagemUseCase } from './use-cases/processar-imagem.use-case';

@Injectable()
export class AuditoriaService {
  constructor(
    private readonly processarImagemUseCase: ProcessarImagemUseCase,
  ) {}

  async iniciar(ctx: Context): Promise<void> {
    await ctx.reply(
      '📸 Auditoria de imagens iniciada!\n\n' +
        'Etapa 1 de 3\n\n' +
        'Envie a foto da traseira da ONU.',
    );

    // Aqui, posteriormente, vamos salvar a etapa atual
    // do usuário como ONU.
  }

  async processarImagem(ctx: Context): Promise<void> {
    await this.processarImagemUseCase.execute(ctx);
  }
}
