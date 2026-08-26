import { Module } from '@nestjs/common';

import { AuditoriaService } from './application/auditoria.service';

@Module({
  providers: [AuditoriaService],

  exports: [AuditoriaService],
})
export class AuditoriaModule {}
