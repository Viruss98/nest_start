import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUserRest, RestAuthCookie } from 'src/decorators/common.decorator';
import { ImageResizeCommand } from './commands/image-resize.command';
import { MulterFile } from './media.interface';
import { MediaService } from './services/media.service';
import { uploadMediaBase64 } from 'src/helpers/s3';
import { MediaEntity } from './entities/media.entity';
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService, private commandBus: CommandBus) {}

  // @RestAuthCookie()
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (_req, file, callback) => {
        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: MulterFile, @CurrentUserRest('id') id: string) {
    this.commandBus.execute(new ImageResizeCommand(file.destination, file.filename)).finally(() => {
      //
    });
    // console.log(123);
    // // return true;
    // return this.mediaService.addMedia(
    //   {
    //     name: file.originalname,
    //     mimeType: file.mimetype,
    //     filePath: file.path,
    //     fileSize: file.size,
    //     ownerId: id,
    //   },
    //   // parentId,
    // );
    // const ext = path.extname(file.originalname.toLowerCase());
    // const fileName = new Date().getTime() + ext;
    // const response = await uploadMediaBase64(file, fileName);
    // const newMedia = new MediaEntity({
    //   name: file.originalname,
    //   fileName: fileName,
    //   filePath: response.Location,
    //   mimeType: file.mimetype,
    // });
    // return this.mediaService.addMedia(newMedia);
  }
}

// const readStream = file.createReadStream();
// const id = nanoid();
// const fileExt = extname(file.filename);
// const originalPath = join(this.options.uploadDir, `${id}${fileExt}`);
// const options: ManagedUpload.ManagedUploadOptions = {
//   partSize: 5 * 1024 * 1024,
//   queueSize: 10,
// };
// const res = await s3
//   .upload(
//     {
//       Bucket: process.env.AWS_S3_BUCKET_NAME ?? '',
//       Body: readStream,
//       Key: originalPath,
//       ACL: 'public-read',
//     },
//     options,
//   )
//   .promise();

// return await this.mediaService.addMedia(
//   {
//     name: res.Key,
//     mimeType: file.mimetype,
//     filePath: res.Location,
//     type: FileTypeEnum.FILE,
//     ownerId: currentUser.id,
//   },
//   parentId,
// );
