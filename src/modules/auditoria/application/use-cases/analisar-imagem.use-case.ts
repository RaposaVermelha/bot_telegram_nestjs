import { Injectable } from '@nestjs/common';

import { ResultadoVision } from '../../../../shared/types/resultado-vision.type';
import { AuditoriaEtapa } from '../../domain/enums/auditoria-etapa.enum';
import { AuditoriaValidatorService } from '../../domain/services/auditoria-validator.service';

@Injectable()
export class AnalisarImagemUseCase {
  constructor(private readonly validator: AuditoriaValidatorService) {}

  executar(etapa: AuditoriaEtapa, resultado: ResultadoVision) {
    const aprovada = this.validator.validarImagem(etapa, resultado);

    if (!aprovada) {
      return {
        aprovada: false,
        etapa,
        mensagem: '❌ A imagem enviada não corresponde à etapa atual.',
      };
    }

    const proximaEtapa = this.validator.proximaEtapa(etapa);

    return {
      aprovada: true,
      etapa,
      proximaEtapa,
    };
  }
}
