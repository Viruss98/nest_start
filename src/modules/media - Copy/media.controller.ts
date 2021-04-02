import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUserRest, RestAuthCookie } from 'src/decorators/common.decorator';
import { ImageResizeCommand } from './commands/image-resize.command';
import { MulterFile } from './media.interface';
import { MediaService } from './services/media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService, private commandBus: CommandBus) {}

  @RestAuthCookie()
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
    // return true;
    return this.mediaService.addMedia(
      {
        name: file.originalname,
        mimeType: file.mimetype,
        filePath: file.path,
        fileSize: file.size,
        ownerId: id,
      },
      // parentId,
    );
  }
}
