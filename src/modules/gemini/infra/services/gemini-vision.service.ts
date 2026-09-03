import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';

const PROMPT_CLASSIFICACAO = `Classifique a imagem de auditoria técnica de telecomunicações em exatamente um contexto.

Contextos possíveis:
- ONU_TRASEIRA: a imagem mostra principalmente a parte traseira de uma ONU/ONT.
- POTENCIA_CTO: a imagem mostra uma CTO e uma medição de potência com power meter (ou equipamento equivalente), com evidência visual de CTO, do medidor e de display/indicador ou leitura de potência.
- POTENCIA_CASA: a imagem mostra uma ONU/ONT e uma medição de potência com power meter. Não é necessário existir uma CTO.
- DESCONHECIDO: a imagem não corresponde claramente a nenhum dos contextos anteriores.

Responda somente com um JSON válido, sem markdown, sem crases e sem texto fora do JSON.
Formato obrigatório:
{"contexto":"POTENCIA_CTO"}`;

@Injectable()
export class GeminiVisionService {
  private readonly client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async analisarImagem(imagem: Buffer, mimeType: string): Promise<string> {
    const base64Imagem = imagem.toString('base64');

    const response = await this.client.interactions.create({
      model: 'gemini-3.7-flash',
      input: [
        {
          type: 'text',
          text: PROMPT_CLASSIFICACAO,
        },
        {
          type: 'image',
          data: base64Imagem,
          mime_type: mimeType,
        },
      ],
    });

    const output = response.output_text;

    if (!output) {
      throw new Error('Gemini não retornou texto');
    }

    return output;
  }
}
