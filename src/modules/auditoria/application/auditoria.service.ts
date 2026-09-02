import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

import { IniciarAuditoriaUseCase } from './use-cases/iniciar-auditoria.use-case';
import { ProcessarImagemUseCase } from './use-cases/processar-imagem.use-case';

@Injectable()
export class AuditoriaService {
  constructor(
    private readonly iniciarAuditoriaUseCase: IniciarAuditoriaUseCase,
    private readonly processarImagemUseCase: ProcessarImagemUseCase,
  ) {}

  async iniciar(ctx: Context): Promise<void> {
    await this.iniciarAuditoriaUseCase.execute(ctx);
  }

  async processarImagem(ctx: Context): Promise<void> {
    await this.processarImagemUseCase.execute(ctx);
  }
}
