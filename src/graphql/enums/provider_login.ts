import { registerEnumType } from '@nestjs/graphql';

export enum ProviderLoginEnum {
  MOBILE_APP = 'MOBILE_APP',
  WEB_APP = 'WEB_APP',
  WEB_ADMIN = 'WEB_ADMIN',
}

registerEnumType(ProviderLoginEnum, {
  name: 'ProviderLoginEnum',
});
