import { Injectable } from '@nestjs/common';

@Injectable()
export class ConsultaPotenciaService {
  async iniciar(ctx: any) {
    await ctx.reply('📋 Informe o login PPPoE:');
  }
}
