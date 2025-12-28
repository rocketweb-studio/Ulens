// converterToMP3.ts
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export async function convertWebmToMp3(blob: Blob): Promise<Blob> {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();

    // Правильные URL для CDN
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/';

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}ffmpeg-core.wasm`, 'application/wasm'),
    });
  }

  await ffmpeg.writeFile('input.webm', await fetchFile(blob));

  await ffmpeg.exec([
    '-i', 'input.webm',
    '-vn',
    '-acodec', 'libmp3lame',
    '-ab', '128k',
    '-ac', '1',
    'output.mp3',
  ]);

  const data = await ffmpeg.readFile('output.mp3');
//@ts-ignore
  return new Blob([data], { type: 'audio/mpeg' });
}
