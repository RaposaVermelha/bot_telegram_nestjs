import { Inject, Injectable, Logger } from '@nestjs/common';
import { Context } from 'telegraf';

import { ResultadoVision } from '../../../../shared/types/resultado-vision.type';
import {
  AUDITORIA_REPOSITORY,
  type AuditoriaRepository,
} from '../../domain/repositories/auditoria.repository';
import { AuditoriaValidatorService } from '../../domain/services/auditoria-validator.service';
import { PythonVisionError } from '../../infra/errors/python-vision.error';
import { PythonVisionService } from '../../infra/services/python-vision.service';
import {
  AuditoriaMessages,
  mensagemAprovacao,
} from '../messages/auditoria.messages';

@Injectable()
export class ProcessarImagemUseCase {
  private readonly logger = new Logger(ProcessarImagemUseCase.name);

  constructor(
    @Inject(AUDITORIA_REPOSITORY)
    private readonly auditoriaRepository: AuditoriaRepository,
    private readonly pythonVision: PythonVisionService,
    private readonly validator: AuditoriaValidatorService,
  ) {}

  async execute(ctx: Context): Promise<void> {
    try {
      const chatId = ctx.chat?.id;

      if (!chatId) {
        this.logger.warn('processarImagem: chatId ausente no contexto');
        return;
      }

      const auditoria = this.auditoriaRepository.buscarPorChatId(chatId);

      if (!auditoria) {
        await ctx.reply(AuditoriaMessages.semAuditoria);
        return;
      }

      if (auditoria.isConcluida()) {
        await ctx.reply(AuditoriaMessages.jaConcluida);
        return;
      }

      const imagem = await this.obterImagem(ctx);

      if (!imagem) {
        await ctx.reply(AuditoriaMessages.semImagem);
        return;
      }

      await ctx.reply(AuditoriaMessages.analisando);

      const etapaAtual = auditoria.getEtapa();
      const resultado = await this.analisarImagem(imagem);

      if (!resultado) {
        await ctx.reply(AuditoriaMessages.resultadoInvalido);
        return;
      }

      const valida = this.validator.validarImagem(etapaAtual, resultado);

      if (!valida) {
        await ctx.reply(AuditoriaMessages.imagemInvalida(etapaAtual));
        return;
      }

      const proximaEtapa = this.validator.proximaEtapa(etapaAtual);
      auditoria.avancarPara(proximaEtapa);
      this.auditoriaRepository.atualizar(auditoria);

      await ctx.reply(mensagemAprovacao(etapaAtual));
    } catch (error) {
      this.logger.error(
        'Erro ao processar imagem da auditoria',
        error instanceof Error ? error.stack : error,
      );
      await this.responderErro(ctx, error);
    }
  }

  private async obterImagem(ctx: Context): Promise<Buffer | null> {
    const message = ctx.message;

    if (!message || !('photo' in message) || !message.photo?.length) {
      this.logger.warn('Mensagem sem foto para processar');
      return null;
    }

    const photo = message.photo[message.photo.length - 1];

    if (!photo?.file_id) {
      return null;
    }

    try {
      const fileLink = await ctx.telegram.getFileLink(photo.file_id);
      const response = await fetch(fileLink.href);

      if (!response.ok) {
        this.logger.error(
          `Falha ao baixar foto do Telegram: ${response.status}`,
        );
        return null;
      }

      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      this.logger.error(
        'Erro ao obter imagem do Telegram',
        error instanceof Error ? error.stack : error,
      );
      return null;
    }
  }

  private async analisarImagem(
    imagem: Buffer,
  ): Promise<ResultadoVision | null> {
    const resultado = await this.pythonVision.analisar(imagem);

    if (!resultado || typeof resultado.contexto !== 'string') {
      this.logger.warn(
        `Resultado do Python incompleto: ${JSON.stringify(resultado)}`,
      );
      return null;
    }

    return resultado;
  }

  private async responderErro(ctx: Context, error: unknown): Promise<void> {
    try {
      const mensagem =
        error instanceof PythonVisionError
          ? AuditoriaMessages.erroPython
          : AuditoriaMessages.erroGenerico;

      await ctx.reply(mensagem);
    } catch (replyError) {
      this.logger.error(
        'Falha ao enviar mensagem de erro ao usuário',
        replyError instanceof Error ? replyError.stack : replyError,
      );
    }
  }
}
