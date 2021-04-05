import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { extname } from 'path';

@Injectable()
export class SharpService {
  resize = async (
    imgPath: string,
    fileName: string,
    option: { width: number; height: number; quality: number; mode?: string },
  ) => {
    const fileExtName = extname(fileName);
    const image = sharp(`${imgPath}/${fileName}`);
    return Promise.all([
      image
        .clone()
        .resize({
          width: 200,
          height: 200,
          fit: sharp.fit.cover,
          position: sharp.strategy.entropy,
        })
        .jpeg({
          quality: option.quality,
          progressive: true,
        })
        .toFile(`${imgPath}/thumb${fileExtName}`),
      image
        .clone()
        .resize({
          width: 500,
          withoutEnlargement: true,
        })
        .jpeg({
          quality: option.quality,
          progressive: true,
        })
        .toFile(`${imgPath}/medium${fileExtName}`),
    ]);
  };
}
