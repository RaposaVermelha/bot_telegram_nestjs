export class Auditoria {
  constructor(
    public readonly chatId: number,
    private etapa: string,
  ) {}

  getEtapa(): string {
    return this.etapa;
  }

  avancar(etapa: string): void {
    this.etapa = etapa;
  }
}
