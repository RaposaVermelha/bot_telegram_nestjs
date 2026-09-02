import { Context } from 'telegraf';

import { AuditoriaEtapa } from '../../domain/enums/auditoria-etapa.enum';
import { InMemoryAuditoriaRepository } from '../../infra/repositories/in-memory-auditoria.repository';
import { AuditoriaMessages } from '../messages/auditoria.messages';
import { IniciarAuditoriaUseCase } from './iniciar-auditoria.use-case';

describe('IniciarAuditoriaUseCase', () => {
  it('inicia auditoria na etapa ONU', async () => {
    const repository = new InMemoryAuditoriaRepository();
    const useCase = new IniciarAuditoriaUseCase(repository);
    const ctx = {
      chat: { id: 7 },
      reply: jest.fn().mockResolvedValue(undefined),
    } as unknown as Context;

    await useCase.execute(ctx);

    const auditoria = repository.buscarPorChatId(7);
    expect(auditoria?.getEtapa()).toBe(AuditoriaEtapa.ONU);
    expect(auditoria?.isConcluida()).toBe(false);
    expect(ctx.reply).toHaveBeenCalledWith(AuditoriaMessages.iniciada);
  });
});
