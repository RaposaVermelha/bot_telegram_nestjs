import { Injectable } from '@nestjs/common';

import { AuditoriaEntity } from '../../domain/entities/auditoria.entitiy';
import { AuditoriaRepository } from '../../domain/repositories/auditoria.repository';

@Injectable()
export class InMemoryAuditoriaRepository implements AuditoriaRepository {
  private readonly store = new Map<number, AuditoriaEntity>();

  criar(auditoria: AuditoriaEntity): void {
    this.store.set(auditoria.chatId, auditoria);
  }

  buscarPorChatId(chatId: number): AuditoriaEntity | undefined {
    return this.store.get(chatId);
  }

  atualizar(auditoria: AuditoriaEntity): void {
    this.store.set(auditoria.chatId, auditoria);
  }

  remover(chatId: number): void {
    this.store.delete(chatId);
  }
}
