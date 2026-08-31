import { Module } from '@nestjs/common';

import { AuditoriaService } from './application/auditoria.service';
import { ProcessarImagemUseCase } from './application/use-cases/processar-imagem.use-case';
import { PythonVisionService } from './infra/services/python-vision.service';

@Module({
  providers: [AuditoriaService, ProcessarImagemUseCase, PythonVisionService],
  exports: [AuditoriaService],
})
export class AuditoriaModule {}
