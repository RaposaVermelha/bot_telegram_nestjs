export interface ObjetoVision {
  classe: string;
  confianca: number;
  box?: number[];
}

export interface ResultadoVision {
  arquivo?: string;
  nitidez?: number;
  qualidade?: number;
  aprovada?: boolean;
  contexto: string;
  objetos?: ObjetoVision[];
}
