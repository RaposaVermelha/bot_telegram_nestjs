import { Module } from '@nestjs/common';

import { AuditoriaService } from './application/auditoria.service';
import { IniciarAuditoriaUseCase } from './application/use-cases/iniciar-auditoria.use-case';
import { ProcessarImagemUseCase } from './application/use-cases/processar-imagem.use-case';
import { AUDITORIA_REPOSITORY } from './domain/repositories/auditoria.repository';
import { AuditoriaValidatorService } from './domain/services/auditoria-validator.service';
import { InMemoryAuditoriaRepository } from './infra/repositories/in-memory-auditoria.repository';
import { PythonVisionService } from './infra/services/python-vision.service';

@Module({
  providers: [
    AuditoriaService,
    IniciarAuditoriaUseCase,
    ProcessarImagemUseCase,
    PythonVisionService,
    AuditoriaValidatorService,
    {
      provide: AUDITORIA_REPOSITORY,
      useClass: InMemoryAuditoriaRepository,
    },
  ],
  exports: [AuditoriaService],
})
export class AuditoriaModule {}
