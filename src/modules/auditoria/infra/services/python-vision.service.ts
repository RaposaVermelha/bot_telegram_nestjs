import { Injectable, Logger } from '@nestjs/common';

import { ResultadoVision } from '../../../../shared/types/resultado-vision.type';
import { VisionService } from '../../domain/services/vision.service';
import { PythonVisionError } from '../errors/python-vision.error';

@Injectable()
export class PythonVisionService implements VisionService {
  private readonly logger = new Logger(PythonVisionService.name);
  private readonly url = 'http://localhost:5001/analisar';

  async analisar(imagem: Buffer): Promise<ResultadoVision> {
    try {
      const formData = new FormData();
      formData.append(
        'imagem',
        new Blob([new Uint8Array(imagem)]),
        'imagem.jpg',
      );

      const resultado = await fetch(this.url, {
        method: 'POST',
        body: formData,
      });

      if (!resultado.ok) {
        throw new PythonVisionError(
          `Python Vision retornou ${resultado.status}`,
        );
      }

      return (await resultado.json()) as ResultadoVision;
    } catch (error) {
      if (error instanceof PythonVisionError) {
        throw error;
      }

      this.logger.error(
        'Falha na comunicação com o serviço Python',
        error instanceof Error ? error.stack : error,
      );

      throw new PythonVisionError('Falha ao analisar imagem no Python Vision');
    }
  }
}
