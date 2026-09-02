import { AuditoriaEtapa } from '../../domain/enums/auditoria-etapa.enum';

export const AuditoriaMessages = {
  iniciada:
    '📸 Auditoria iniciada!\n\n' +
    'Etapa 1 de 3\n\n' +
    'Envie a foto da traseira da ONU.',

  analisando: '📸 Imagem recebida!\n\n⏳ Analisando...',

  onuAprovada:
    '✅ Foto da ONU aprovada!\n\n' +
    'Agora envie a foto da CTO com a medição de potência.',

  ctoAprovada:
    '✅ Foto da CTO aprovada!\n\n' +
    'Agora envie a foto da medição de potência na casa.',

  concluida: '✅ Auditoria concluída!',

  semAuditoria:
    'Você ainda não iniciou uma auditoria.\n\nDigite 2 para começar.',

  jaConcluida:
    'Esta auditoria já foi concluída.\n\nDigite 2 para iniciar uma nova.',

  semImagem: 'Não foi possível obter a foto. Envie uma imagem novamente.',

  erroPython:
    'Não foi possível analisar a imagem no momento. Tente novamente em instantes.',

  resultadoInvalido:
    'Não foi possível interpretar o resultado da análise. Envie a foto novamente.',

  erroGenerico: 'Ocorreu um erro ao processar a imagem. Tente novamente.',

  imagemInvalida(etapa: AuditoriaEtapa): string {
    return (
      '❌ Imagem não corresponde à etapa atual.\n\n' +
      `Estamos aguardando ${descricaoEtapa(etapa)}.\n\n` +
      'Envie uma nova foto.'
    );
  },
};

export function descricaoEtapa(etapa: AuditoriaEtapa): string {
  switch (etapa) {
    case AuditoriaEtapa.ONU:
      return 'a foto da traseira da ONU';
    case AuditoriaEtapa.CTO:
      return 'a foto da CTO com a medição de potência';
    case AuditoriaEtapa.CASA:
      return 'a foto da medição de potência na casa';
    default:
      return 'a foto da etapa atual';
  }
}

export function mensagemAprovacao(etapaValidada: AuditoriaEtapa): string {
  switch (etapaValidada) {
    case AuditoriaEtapa.ONU:
      return AuditoriaMessages.onuAprovada;
    case AuditoriaEtapa.CTO:
      return AuditoriaMessages.ctoAprovada;
    case AuditoriaEtapa.CASA:
      return AuditoriaMessages.concluida;
    default:
      return AuditoriaMessages.concluida;
  }
}
