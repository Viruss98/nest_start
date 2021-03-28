import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { createWriteStream, Stats, statSync, unlink } from 'fs';
import { extname, join } from 'path';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { nanoid } from 'nanoid';
import { CurrentUser, AuthJwt } from 'src/decorators/common.decorator';
import { User } from '../../users/entities/users.entity';
import { CreateDirArgs } from '../dto/create_dir.args';
import { MediaEntity } from '../entities/media.entity';
import { FileTypeEnum } from 'src/graphql/enums/file_type';
import { MediaService } from '../services/media.service';
import { UploadProvider } from 'src/graphql/enums/upload_provider';
import { ID } from '@nestjs/graphql';
import { UpdateMediaInput } from '../dto/update_media.input';
import { MEDIA_OPTIONS } from '../constants';
import { MediaOptions } from '../media.interface';
import { s3, createUploadStream } from 'src/helpers/s3';
import { ManagedUpload } from 'aws-sdk/clients/s3';

@Resolver(() => MediaEntity)
export class MediaMutationsResolver {
  @Inject(MEDIA_OPTIONS)
  private readonly options: MediaOptions;
  constructor(private readonly mediaService: MediaService) {}

  @Mutation(() => MediaEntity)
  // @AuthJwt()
  async uploadMedia(
    @Args({ type: () => GraphQLUpload, name: 'file' }) file: FileUpload,
    @Args({ type: () => ID, name: 'parentId', nullable: true }) parentId: string,
    @Args({ type: () => String, name: 'provider', nullable: true, defaultValue: UploadProvider.LOCAL })
    provider: UploadProvider,
    // @CurrentUser() currentUser: User,
  ): Promise<MediaEntity> {
    const { createReadStream, filename, mimetype } = file;
    const id = nanoid();
    const fileExt = extname(filename);
    const originalPath = join(this.options.uploadDir, `${id}${fileExt}`);
    let filePath = originalPath;
    let fileSize: number | undefined;
    if (provider === UploadProvider.S3) {
      const options: ManagedUpload.ManagedUploadOptions = {
        partSize: 5 * 1024 * 1024,
        queueSize: 10,
      };
      const uploadStream = createUploadStream({ Key: originalPath, ContentType: mimetype }, options);
      createReadStream().pipe(uploadStream.writeStream);
      const res = await uploadStream.promise;
      filePath = res.Location;
    } else {
      // Jimp.read
      const writeStream = createWriteStream(originalPath);
      const stream = createReadStream();
      try {
        const stats: Stats = await new Promise((resolve, reject) => {
          writeStream.on('finish', () => {
            const stats = statSync(originalPath);
            resolve(stats);
          });
          writeStream.on('error', (error) => {
            unlink(originalPath, () => {
              reject(error);
            });
          });

          stream.on('error', reject);
          stream.pipe(writeStream);
        });
        filePath = originalPath;
        fileSize = stats.size;
      } catch (err) {
        //
        // console.log(1212, err);
      }
    }

    return await this.mediaService.addMedia(
      {
        name: `${id}${fileExt}`,
        mimeType: file.mimetype,
        filePath: filePath,
        fileSize: fileSize,
        type: FileTypeEnum.FILE,
        // ownerId: currentUser.id,
      },
      parentId,
    );
  }

  @Mutation(() => MediaEntity)
  @AuthJwt()
  async uploadMediaToS3(
    @Args({ type: () => GraphQLUpload, name: 'file' }) file: FileUpload,
    @Args({ type: () => ID, name: 'parentId', nullable: true }) parentId: string,
    @CurrentUser() currentUser: User,
  ): Promise<MediaEntity> {
    const readStream = file.createReadStream();
    const id = nanoid();
    const fileExt = extname(file.filename);
    const originalPath = join(this.options.uploadDir, `${id}${fileExt}`);
    const options: ManagedUpload.ManagedUploadOptions = {
      partSize: 5 * 1024 * 1024,
      queueSize: 10,
    };
    const res = await s3
      .upload(
        {
          Bucket: process.env.AWS_S3_BUCKET_NAME ?? '',
          Body: readStream,
          Key: originalPath,
          ACL: 'public-read',
        },
        options,
      )
      .promise();

    return await this.mediaService.addMedia(
      {
        name: res.Key,
        mimeType: file.mimetype,
        filePath: res.Location,
        type: FileTypeEnum.FILE,
        ownerId: currentUser.id,
      },
      parentId,
    );
  }

  @Mutation(() => Boolean)
  @AuthJwt()
  async removeMedia(@Args({ type: () => ID, name: 'id', nullable: true }) id: string): Promise<boolean> {
    return await this.mediaService.removeMedia(id);
  }

  @Mutation(() => MediaEntity)
  @AuthJwt()
  async updateMedia(
    @Args({ type: () => UpdateMediaInput, name: 'input', nullable: false }) input: UpdateMediaInput,
  ): Promise<MediaEntity> {
    return await this.mediaService.updateMedia(input);
  }

  @Mutation(() => MediaEntity)
  @AuthJwt()
  async createDir(@Args() data: CreateDirArgs, @CurrentUser() currentUser: User): Promise<MediaEntity> {
    return await this.mediaService.addMedia(
      {
        name: data.dirName,
        ownerId: currentUser.id,
        type: FileTypeEnum.DIR,
      },
      data.parentId,
    );
  }
}
