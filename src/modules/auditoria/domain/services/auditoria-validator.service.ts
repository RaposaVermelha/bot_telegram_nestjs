import { Injectable } from '@nestjs/common';

import { ResultadoVision } from '../../../../shared/types/resultado-vision.type';
import { AuditoriaEtapa } from '../enums/auditoria-etapa.enum';

@Injectable()
export class AuditoriaValidatorService {
  validarImagem(etapa: AuditoriaEtapa, resultado: ResultadoVision): boolean {
    if (!resultado?.contexto) {
      return false;
    }

    switch (etapa) {
      case AuditoriaEtapa.ONU:
        return resultado.contexto === 'ONU_TRASEIRA';

      case AuditoriaEtapa.CTO:
        return resultado.contexto === 'POTENCIA_CTO';

      case AuditoriaEtapa.CASA:
        return resultado.contexto === 'POTENCIA_CASA';

      default:
        return false;
    }
  }

  proximaEtapa(etapa: AuditoriaEtapa): AuditoriaEtapa {
    switch (etapa) {
      case AuditoriaEtapa.ONU:
        return AuditoriaEtapa.CTO;

      case AuditoriaEtapa.CTO:
        return AuditoriaEtapa.CASA;

      case AuditoriaEtapa.CASA:
        return AuditoriaEtapa.CONCLUIDA;

      default:
        return AuditoriaEtapa.CONCLUIDA;
    }
  }
}
