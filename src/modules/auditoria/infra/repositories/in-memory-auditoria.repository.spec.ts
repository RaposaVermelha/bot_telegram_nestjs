import { AuditoriaEntity } from '../../domain/entities/auditoria.entitiy';
import { AuditoriaEtapa } from '../../domain/enums/auditoria-etapa.enum';
import { AuditoriaStatus } from '../../domain/enums/auditoria-status.enum';
import { InMemoryAuditoriaRepository } from './in-memory-auditoria.repository';

describe('InMemoryAuditoriaRepository', () => {
  let repository: InMemoryAuditoriaRepository;

  beforeEach(() => {
    repository = new InMemoryAuditoriaRepository();
  });

  it('cria e recupera uma auditoria', () => {
    const auditoria = AuditoriaEntity.iniciar(100);

    repository.criar(auditoria);

    const encontrada = repository.buscarPorChatId(100);

    expect(encontrada).toBe(auditoria);
    expect(encontrada?.getEtapa()).toBe(AuditoriaEtapa.ONU);
    expect(encontrada?.getStatus()).toBe(AuditoriaStatus.EM_ANDAMENTO);
  });

  it('não encontra auditoria inexistente', () => {
    expect(repository.buscarPorChatId(999)).toBeUndefined();
  });

  it('atualiza a etapa da auditoria', () => {
    const auditoria = AuditoriaEntity.iniciar(10);
    repository.criar(auditoria);

    auditoria.avancarPara(AuditoriaEtapa.CTO);
    repository.atualizar(auditoria);

    expect(repository.buscarPorChatId(10)?.getEtapa()).toBe(AuditoriaEtapa.CTO);
  });

  it('conclui a auditoria', () => {
    const auditoria = AuditoriaEntity.iniciar(10);
    repository.criar(auditoria);

    auditoria.concluir();
    repository.atualizar(auditoria);

    const encontrada = repository.buscarPorChatId(10);
    expect(encontrada?.isConcluida()).toBe(true);
    expect(encontrada?.getEtapa()).toBe(AuditoriaEtapa.CONCLUIDA);
    expect(encontrada?.getStatus()).toBe(AuditoriaStatus.CONCLUIDA);
  });

  it('remove auditoria', () => {
    repository.criar(AuditoriaEntity.iniciar(10));
    repository.remover(10);
    expect(repository.buscarPorChatId(10)).toBeUndefined();
  });
});
