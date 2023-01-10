export const enum MediaType {
  Video = 'video',
  Audio = 'audio',
  Image = 'image',
}

export const enum VideoContainerType {
  MP4 = 'mp4',
}

export const enum AudioContainerType {
  MP3 = 'mp3',
}

export const enum ImageContainerType {
  PNG = 'png',
}

export const enum VideoCodec {
  H264 = 'h264',
}

export const enum AudioCodec {
  AAC = 'aac',
}

export const enum ImageEncoding {
  PNG = 'png',
}

export type MediaInfo = MediaVideoInfo | MediaAudioInfo | MediaImageInfo;

export type MediaVideoInfo = {
  type: MediaType.Video;
  container: VideoContainerType;
  video: VideoInfo;
  audio: AudioInfo[];
};
export type MediaAudioInfo = {
  type: MediaType.Audio;
  container: AudioContainerType;
  audio: AudioInfo[];
};
export type MediaImageInfo = {
  type: MediaType.Image;
  container: ImageContainerType;
  image: ImageInfo;
};

export interface VideoInfo {
  width: number;
  height: number;
  frameRate: number;
  duration: number;
  codec: VideoCodec;
}

export interface AudioInfo {
  sampleRate: number;
  codec: AudioCodec;
  duration: number;
  numChannels: number;
}

export interface ImageInfo {
  width: number;
  height: number;
  encoding: ImageEncoding;
}

export class VideoProbe {
  private _mediaInfo: MediaVideoInfo;

  constructor(video: HTMLVideoElement) {
    // TODO: Implement this using ffprobe-wasm
    this._mediaInfo = {
      type: MediaType.Video,
      container: VideoContainerType.MP4,
      video: {
        width: video.videoWidth,
        height: video.videoHeight,
        frameRate: 30,
        duration: video.duration,
        codec: VideoCodec.H264,
      },
      audio: [
        {
          codec: AudioCodec.AAC,
          duration: video.duration,
          numChannels: 2,
          sampleRate: 44100,
        },
      ],
    };
  }

  public get mediaInfo(): MediaVideoInfo {
    return this._mediaInfo;
  }
}
