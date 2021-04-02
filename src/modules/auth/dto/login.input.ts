import { InputType } from '@nestjs/graphql';
import { ProviderLoginEnum } from 'src/graphql/enums/provider_login';

@InputType()
export class AppLoginInput {
  username: string;

  password: string;

  provider: ProviderLoginEnum;
}
