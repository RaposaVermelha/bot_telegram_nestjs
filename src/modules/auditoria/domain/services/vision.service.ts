import { ResultadoVision } from '../../../../shared/types/resultado-vision.type';

export interface VisionService {
  analisar(imagem: Buffer): Promise<ResultadoVision>;
}
