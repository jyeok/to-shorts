import {
  createFFmpeg,
  CreateFFmpegOptions,
  fetchFile,
  FFmpeg,
} from '@ffmpeg/ffmpeg';

export const scaleVideo = async (file: File) => {
  const ffmpeg = await getFFMpeg();
  const fileName = file.name;

  ffmpeg.FS('writeFile', fileName, await fetchFile(file));
  await ffmpeg.run(
    '-i',
    fileName,
    '-vf',
    'pad=iw:2*trunc(iw*16/18):(ow-iw)/2:(oh-ih)/2',
    '-c:a',
    'copy',
    'output.mp4',
  );
  const data = ffmpeg.FS('readFile', 'output.mp4');

  return new Blob([data.buffer], { type: 'video/mp4' });
};

export const transcodeToMp4 = async (file: File) => {
  const ffmpeg = await getFFMpeg();
  const fileName = file.name;

  ffmpeg.FS('writeFile', fileName, await fetchFile(file));
  await ffmpeg.run(
    '-i',
    fileName,
    '-c:v',
    'libx264',
    '-crf',
    '22',
    '-c:a',
    'aac',
    '-b:a',
    '192k',
    'output.mp4',
  );
  const data = ffmpeg.FS('readFile', 'output.mp4');

  return new Blob([data.buffer], { type: 'video/mp4' });
};

let ffmpeg: undefined | FFmpeg = undefined;
export const getFFMpeg = async (options?: CreateFFmpegOptions) => {
  if (ffmpeg) return ffmpeg;
  ffmpeg = createFFmpeg(
    options ?? {
      log: true,
      progress: (p) => console.log(p),
    },
  );
  await ffmpeg.load();
  return ffmpeg;
};
export const cleanUpFFMpeg = () => {
  if (ffmpeg) {
    ffmpeg.exit();
    ffmpeg = undefined;
  }
};
