import { Module } from '@nestjs/common';

import { GeminiModule } from '../gemini/gemini.modulo';
import { AuditoriaService } from './application/auditoria.service';
import { IniciarAuditoriaUseCase } from './application/use-cases/iniciar-auditoria.use-case';
import { ProcessarImagemUseCase } from './application/use-cases/processar-imagem.use-case';
import { AUDITORIA_REPOSITORY } from './domain/repositories/auditoria.repository';
import { AuditoriaValidatorService } from './domain/services/auditoria-validator.service';
import { InMemoryAuditoriaRepository } from './infra/repositories/in-memory-auditoria.repository';

@Module({
  imports: [GeminiModule],
  providers: [
    AuditoriaService,
    IniciarAuditoriaUseCase,
    ProcessarImagemUseCase,
    AuditoriaValidatorService,
    {
      provide: AUDITORIA_REPOSITORY,
      useClass: InMemoryAuditoriaRepository,
    },
  ],
  exports: [AuditoriaService],
})
export class AuditoriaModule {}
