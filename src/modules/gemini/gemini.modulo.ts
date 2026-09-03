import { Module } from '@nestjs/common';
import { GeminiVisionService } from './infra/services/gemini-vision.service';

@Module({
  providers: [GeminiVisionService],
  exports: [GeminiVisionService],
})
export class GeminiModule {}
