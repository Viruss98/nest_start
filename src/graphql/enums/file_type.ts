import { registerEnumType } from '@nestjs/graphql';

export enum FileTypeEnum {
  FILE = 'file',
  DIR = 'dir',
}

registerEnumType(FileTypeEnum, {
  name: 'FileType',
});
