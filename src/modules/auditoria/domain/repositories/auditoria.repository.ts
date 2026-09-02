import { AuditoriaEntity } from '../entities/auditoria.entitiy';

export const AUDITORIA_REPOSITORY = Symbol('AUDITORIA_REPOSITORY');

export interface AuditoriaRepository {
  criar(auditoria: AuditoriaEntity): void;
  buscarPorChatId(chatId: number): AuditoriaEntity | undefined;
  atualizar(auditoria: AuditoriaEntity): void;
  remover(chatId: number): void;
}
