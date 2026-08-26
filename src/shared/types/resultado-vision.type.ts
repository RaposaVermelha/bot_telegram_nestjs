export interface ResultadoVision {
  contexto: string;
  confianca: number;
  objetos?: Array<{
    classe: string;
    confianca: number;
  }>;
}
