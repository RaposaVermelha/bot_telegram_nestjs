import { Context } from 'telegraf';

import { GeminiVisionService } from '../../../gemini/infra/services/gemini-vision.service';
import { AuditoriaEntity } from '../../domain/entities/auditoria.entitiy';
import { AuditoriaEtapa } from '../../domain/enums/auditoria-etapa.enum';
import { AuditoriaValidatorService } from '../../domain/services/auditoria-validator.service';
import { InMemoryAuditoriaRepository } from '../../infra/repositories/in-memory-auditoria.repository';
import { AuditoriaMessages } from '../messages/auditoria.messages';
import { ProcessarImagemUseCase } from './processar-imagem.use-case';

describe('ProcessarImagemUseCase', () => {
  let repository: InMemoryAuditoriaRepository;
  let geminiVision: { analisarImagem: jest.Mock };
  let useCase: ProcessarImagemUseCase;
  let fetchMock: jest.Mock;

  const criarCtx = (): Context =>
    ({
      chat: { id: 42 },
      message: { photo: [{ file_id: 'file-1' }] },
      telegram: {
        getFileLink: jest
          .fn()
          .mockResolvedValue({ href: 'https://telegram.example/file' }),
      },
      reply: jest.fn().mockResolvedValue(undefined),
    }) as unknown as Context;

  beforeEach(() => {
    repository = new InMemoryAuditoriaRepository();
    geminiVision = { analisarImagem: jest.fn() };
    useCase = new ProcessarImagemUseCase(
      repository,
      new AuditoriaValidatorService(),
      geminiVision as unknown as GeminiVisionService,
    );

    fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
    });
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('imagem correta avança a etapa', async () => {
    repository.criar(AuditoriaEntity.iniciar(42));
    geminiVision.analisarImagem.mockResolvedValue(
      '{"contexto":"ONU_TRASEIRA"}',
    );

    const ctx = criarCtx();
    await useCase.execute(ctx);

    expect(repository.buscarPorChatId(42)?.getEtapa()).toBe(AuditoriaEtapa.CTO);
    expect(ctx.reply).toHaveBeenCalledWith(AuditoriaMessages.onuAprovada);
  });

  it('imagem incorreta não avança a etapa', async () => {
    repository.criar(AuditoriaEntity.iniciar(42));
    geminiVision.analisarImagem.mockResolvedValue(
      '{"contexto":"POTENCIA_CTO"}',
    );

    const ctx = criarCtx();
    await useCase.execute(ctx);

    expect(repository.buscarPorChatId(42)?.getEtapa()).toBe(AuditoriaEtapa.ONU);
    expect(ctx.reply).toHaveBeenCalledWith(
      AuditoriaMessages.imagemInvalida(AuditoriaEtapa.ONU),
    );
  });

  it('informa quando o JSON do Gemini é inválido', async () => {
    repository.criar(AuditoriaEntity.iniciar(42));
    geminiVision.analisarImagem.mockResolvedValue('nao-e-json');

    const ctx = criarCtx();
    await useCase.execute(ctx);

    expect(repository.buscarPorChatId(42)?.getEtapa()).toBe(AuditoriaEtapa.ONU);
    expect(ctx.reply).toHaveBeenCalledWith(AuditoriaMessages.resultadoInvalido);
  });

  it('informa erro quando o Gemini falha', async () => {
    repository.criar(AuditoriaEntity.iniciar(42));
    geminiVision.analisarImagem.mockRejectedValue(
      new Error('Gemini indisponível'),
    );

    const ctx = criarCtx();
    await useCase.execute(ctx);

    expect(repository.buscarPorChatId(42)?.getEtapa()).toBe(AuditoriaEtapa.ONU);
    expect(ctx.reply).toHaveBeenCalledWith(AuditoriaMessages.erroGenerico);
  });

  it('informa quando não há auditoria', async () => {
    const ctx = criarCtx();
    await useCase.execute(ctx);

    expect(geminiVision.analisarImagem).not.toHaveBeenCalled();
    expect(ctx.reply).toHaveBeenCalledWith(AuditoriaMessages.semAuditoria);
  });

  it('informa quando a auditoria já está concluída', async () => {
    const auditoria = AuditoriaEntity.iniciar(42);
    auditoria.concluir();
    repository.criar(auditoria);

    const ctx = criarCtx();
    await useCase.execute(ctx);

    expect(geminiVision.analisarImagem).not.toHaveBeenCalled();
    expect(ctx.reply).toHaveBeenCalledWith(AuditoriaMessages.jaConcluida);
  });
});
