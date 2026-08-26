import { Module } from '@nestjs/common';

import { ConsultaPotenciaService } from './application/consulta-potencia.service';

@Module({
  providers: [ConsultaPotenciaService],

  exports: [ConsultaPotenciaService],
})
export class ConsultaPotenciaModule {}
