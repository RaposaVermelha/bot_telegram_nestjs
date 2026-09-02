import { AuditoriaEtapa } from '../enums/auditoria-etapa.enum';
import { AuditoriaValidatorService } from './auditoria-validator.service';
import { ResultadoVision } from '../../../../shared/types/resultado-vision.type';

describe('AuditoriaValidatorService', () => {
  const validator = new AuditoriaValidatorService();

  const resultado = (contexto: string): ResultadoVision => ({ contexto });

  describe('validarImagem', () => {
    it('ONU + ONU_TRASEIRA = true', () => {
      expect(
        validator.validarImagem(AuditoriaEtapa.ONU, resultado('ONU_TRASEIRA')),
      ).toBe(true);
    });

    it('ONU + POTENCIA_CTO = false', () => {
      expect(
        validator.validarImagem(AuditoriaEtapa.ONU, resultado('POTENCIA_CTO')),
      ).toBe(false);
    });

    it('CTO + POTENCIA_CTO = true', () => {
      expect(
        validator.validarImagem(AuditoriaEtapa.CTO, resultado('POTENCIA_CTO')),
      ).toBe(true);
    });

    it('CTO + ONU_TRASEIRA = false', () => {
      expect(
        validator.validarImagem(AuditoriaEtapa.CTO, resultado('ONU_TRASEIRA')),
      ).toBe(false);
    });

    it('CASA + POTENCIA_CASA = true', () => {
      expect(
        validator.validarImagem(AuditoriaEtapa.CASA, resultado('POTENCIA_CASA')),
      ).toBe(true);
    });

    it('CASA + POTENCIA_CTO = false', () => {
      expect(
        validator.validarImagem(AuditoriaEtapa.CASA, resultado('POTENCIA_CTO')),
      ).toBe(false);
    });
  });

  describe('proximaEtapa', () => {
    it('ONU → CTO', () => {
      expect(validator.proximaEtapa(AuditoriaEtapa.ONU)).toBe(AuditoriaEtapa.CTO);
    });

    it('CTO → CASA', () => {
      expect(validator.proximaEtapa(AuditoriaEtapa.CTO)).toBe(
        AuditoriaEtapa.CASA,
      );
    });

    it('CASA → CONCLUIDA', () => {
      expect(validator.proximaEtapa(AuditoriaEtapa.CASA)).toBe(
        AuditoriaEtapa.CONCLUIDA,
      );
    });
  });
});
