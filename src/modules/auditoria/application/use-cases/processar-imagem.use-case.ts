import { Inject, Injectable, Logger } from '@nestjs/common';
import { Context } from 'telegraf';

import { ResultadoVision } from '../../../../shared/types/resultado-vision.type';
import { GeminiVisionService } from '../../../gemini/infra/services/gemini-vision.service';
import {
  AUDITORIA_REPOSITORY,
  type AuditoriaRepository,
} from '../../domain/repositories/auditoria.repository';
import { AuditoriaValidatorService } from '../../domain/services/auditoria-validator.service';
import {
  AuditoriaMessages,
  mensagemAprovacao,
} from '../messages/auditoria.messages';

const CONTEXTOS_VALIDOS = new Set([
  'ONU_TRASEIRA',
  'POTENCIA_CTO',
  'POTENCIA_CASA',
  'DESCONHECIDO',
]);

@Injectable()
export class ProcessarImagemUseCase {
  private readonly logger = new Logger(ProcessarImagemUseCase.name);

  constructor(
    @Inject(AUDITORIA_REPOSITORY)
    private readonly auditoriaRepository: AuditoriaRepository,
    private readonly validator: AuditoriaValidatorService,
    private readonly geminiVision: GeminiVisionService,
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
      await this.responderErro(ctx);
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
    const resposta = await this.geminiVision.analisarImagem(
      imagem,
      'image/jpeg',
    );

    this.logger.log(`Resultado Gemini: ${resposta}`);

    return this.parseResultadoVision(resposta);
  }

  private parseResultadoVision(resposta: string): ResultadoVision | null {
    if (typeof resposta !== 'string' || !resposta.trim()) {
      this.logger.warn('Resposta do Gemini vazia ou inválida');
      return null;
    }

    try {
      const parsed: unknown = JSON.parse(resposta.trim());

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        this.logger.warn(
          `Resposta do Gemini não é um objeto JSON: ${resposta}`,
        );
        return null;
      }

      const contexto = (parsed as { contexto?: unknown }).contexto;

      if (typeof contexto !== 'string' || !CONTEXTOS_VALIDOS.has(contexto)) {
        this.logger.warn(
          `Contexto inválido retornado pelo Gemini: ${JSON.stringify(parsed)}`,
        );
        return null;
      }

      return { contexto };
    } catch (error) {
      this.logger.warn(
        `JSON malformado retornado pelo Gemini: ${resposta}`,
        error instanceof Error ? error.message : error,
      );
      return null;
    }
  }

  private async responderErro(ctx: Context): Promise<void> {
    try {
      await ctx.reply(AuditoriaMessages.erroGenerico);
    } catch (replyError) {
      this.logger.error(
        'Falha ao enviar mensagem de erro ao usuário',
        replyError instanceof Error ? replyError.stack : replyError,
      );
    }
  }
}
