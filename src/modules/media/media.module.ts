/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint no-console: 0 */
import { DynamicModule, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { existsSync, mkdirSync } from 'fs';
import { UsersModule } from '../users/users.module';
import { MEDIA_OPTIONS } from './constants';
import { MediaEntity } from './entities/media.entity';
import { MediaDataLoader } from './dataloaders/media.dataloader';
import { MediaOptions } from './media.interface';
import { MediaRepository } from './repositories/media.repository';
import { MediaMutationsResolver } from './resolvers/media_mutations.resolver';
import { MediaQueriesResolver } from './resolvers/media_queries.resolver';
import { MediaService } from './services/media.service';
import { MediaFieldResolver } from './resolvers/media_field.resolver';
import { MediaController } from './media.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CqrsModule } from '@nestjs/cqrs';
import { ImageResizeHandler } from './handlers/image-resize.handler';
import { SharpService } from './services/sharp.service';
import { extname } from 'path';
import { nanoid } from 'nanoid';
import fs from 'fs';
@Module({
  controllers: [MediaController],
  imports: [
    CqrsModule,
    UsersModule,
    TypeOrmModule.forFeature([MediaEntity, MediaRepository]),
    MulterModule.register({
      dest: 'uploads',
      storage: diskStorage({
        destination: (_req, file, callback) => {
          const imageDir = `uploads/${nanoid()}`;
          if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir);
          }
          callback(null, imageDir);
        },
        filename: (_req, file, callback) => {
          const fileExtName = extname(file.originalname);
          callback(null, `original${fileExtName}`);
        },
      }),
    }),
  ],
  providers: [
    MediaMutationsResolver,
    MediaService,
    SharpService,
    MediaDataLoader,
    MediaFieldResolver,
    MediaQueriesResolver,
    ImageResizeHandler,
  ],
  exports: [MediaService, MediaDataLoader],
})
export class MediaModule implements OnModuleInit {
  static forRoot(options?: MediaOptions): DynamicModule {
    if (!options?.uploadDir) {
      console.error('Upload dir must be config');
    } else {
      if (!existsSync(options.uploadDir)) mkdirSync(options.uploadDir, { recursive: true, mode: '0777' });
    }
    return {
      module: MediaModule,
      providers: [
        {
          provide: MEDIA_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

  onModuleInit() {
    // console.log(`The module has been initialized.`);
  }
}
