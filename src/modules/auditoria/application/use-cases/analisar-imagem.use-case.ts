import { Injectable } from '@nestjs/common';

import { ResultadoVision } from '../../../../shared/types/resultado-vision.type';
import { AuditoriaEtapa } from '../../domain/enums/auditoria-etapa.enum';
import { AuditoriaService } from '../../domain/services/auditoria.service';

@Injectable()
export class AnalisarImagemUseCase {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  executar(etapa: AuditoriaEtapa, resultado: ResultadoVision) {
    const aprovada = this.auditoriaService.validarImagem(etapa, resultado);

    if (!aprovada) {
      return {
        aprovada: false,
        etapa,
        mensagem: '❌ A imagem enviada não corresponde à etapa atual.',
      };
    }

    const proximaEtapa = this.auditoriaService.proximaEtapa(etapa);

    return {
      aprovada: true,
      etapa,
      proximaEtapa,
    };
  }
}
