import { AuditoriaEtapa } from '../enums/auditoria-etapa.enum';

export class AuditoriaEntity {
  constructor(
    public readonly chatId: number,
    private etapa: AuditoriaEtapa,
  ) {}

  getEtapa(): AuditoriaEtapa {
    return this.etapa;
  }

  avancarPara(etapa: AuditoriaEtapa): void {
    this.etapa = etapa;
  }
}
