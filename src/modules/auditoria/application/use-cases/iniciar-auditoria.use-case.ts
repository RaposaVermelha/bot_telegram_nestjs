import { Inject, Injectable, Logger } from '@nestjs/common';
import { Context } from 'telegraf';

import { AuditoriaEntity } from '../../domain/entities/auditoria.entitiy';
import {
  AUDITORIA_REPOSITORY,
  type AuditoriaRepository,
} from '../../domain/repositories/auditoria.repository';
import { AuditoriaMessages } from '../messages/auditoria.messages';

@Injectable()
export class IniciarAuditoriaUseCase {
  private readonly logger = new Logger(IniciarAuditoriaUseCase.name);

  constructor(
    @Inject(AUDITORIA_REPOSITORY)
    private readonly auditoriaRepository: AuditoriaRepository,
  ) {}

  async execute(ctx: Context): Promise<void> {
    try {
      const chatId = ctx.chat?.id;

      if (!chatId) {
        this.logger.warn('iniciar: chatId ausente no contexto');
        return;
      }

      const auditoria = AuditoriaEntity.iniciar(chatId);
      this.auditoriaRepository.criar(auditoria);

      await ctx.reply(AuditoriaMessages.iniciada);
    } catch (error) {
      this.logger.error(
        'Erro ao iniciar auditoria',
        error instanceof Error ? error.stack : error,
      );

      try {
        await ctx.reply(
          'Não foi possível iniciar a auditoria. Tente novamente.',
        );
      } catch (replyError) {
        this.logger.error(
          'Falha ao enviar mensagem de erro ao usuário',
          replyError instanceof Error ? replyError.stack : replyError,
        );
      }
    }
  }
}
