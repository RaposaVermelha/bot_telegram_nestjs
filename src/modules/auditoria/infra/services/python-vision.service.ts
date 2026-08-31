import { Injectable } from '@nestjs/common';

@Injectable()
export class PythonVisionService {
  private readonly url = 'http://localhost:5001/analisar';

  async analisar(ctx: any) {
    const photo = ctx.message.photo.at(-1);

    const file = await ctx.telegram.getFile(photo.file_id);

    const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

    const response = await fetch(fileUrl);

    const imagem = Buffer.from(await response.arrayBuffer());

    const formData = new FormData();

    formData.append('imagem', new Blob([imagem]), 'imagem.jpg');

    const resultado = await fetch(this.url, {
      method: 'POST',
      body: formData,
    });

    if (!resultado.ok) {
      throw new Error(`Python Vision retornou ${resultado.status}`);
    }

    return resultado.json();
  }
}
