import { Injectable } from '@nestjs/common';

@Injectable()
export class PythonVisionService {
  async analisar(imagem: Buffer) {
    const formData = new FormData();

    formData.append('imagem', new Blob([new Uint8Array(imagem)]), 'imagem.jpg');

    const response = await fetch('http://localhost:5001/analisar', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Python Vision retornou HTTP ${response.status}`);
    }

    return response.json();
  }
}
