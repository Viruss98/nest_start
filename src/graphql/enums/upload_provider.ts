import { registerEnumType } from '@nestjs/graphql';

export enum UploadProvider {
  LOCAL = 'LOCAL',
  S3 = 'S3',
}

registerEnumType(UploadProvider, {
  name: 'UploadProvider',
  description: 'UploadProvider',
});
