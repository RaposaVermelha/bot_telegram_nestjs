import { AuditoriaEtapa } from '../enums/auditoria-etapa.enum';
import { AuditoriaStatus } from '../enums/auditoria-status.enum';

export class AuditoriaEntity {
  constructor(
    public readonly chatId: number,
    private etapa: AuditoriaEtapa,
    private status: AuditoriaStatus = AuditoriaStatus.EM_ANDAMENTO,
  ) {}

  static iniciar(chatId: number): AuditoriaEntity {
    return new AuditoriaEntity(
      chatId,
      AuditoriaEtapa.ONU,
      AuditoriaStatus.EM_ANDAMENTO,
    );
  }

  getEtapa(): AuditoriaEtapa {
    return this.etapa;
  }

  getStatus(): AuditoriaStatus {
    return this.status;
  }

  isConcluida(): boolean {
    return (
      this.status === AuditoriaStatus.CONCLUIDA ||
      this.etapa === AuditoriaEtapa.CONCLUIDA
    );
  }

  avancarPara(etapa: AuditoriaEtapa): void {
    this.etapa = etapa;

    if (etapa === AuditoriaEtapa.CONCLUIDA) {
      this.status = AuditoriaStatus.CONCLUIDA;
    }
  }

  concluir(): void {
    this.etapa = AuditoriaEtapa.CONCLUIDA;
    this.status = AuditoriaStatus.CONCLUIDA;
  }
}
