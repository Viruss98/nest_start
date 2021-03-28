import { createParamDecorator, applyDecorators, UseGuards, ExecutionContext } from '@nestjs/common';
// import { GraphQLContext } from 'src/graphql/app.graphql-context';
import { GraphQLResolveInfo } from 'graphql';
import { GqlAuthGuard, GqlCookieAuthGuard } from 'src/guards/gql-auth.guard';
import { Request, Response } from 'express';
import { User } from 'src/modules/users/entities/users.entity';
import { CookieAuthGuard } from 'src/guards/rest-auth.guard';

type GraphqlContext = {
  req: Request;
  res: Response;
};

type GraphQLExecutionContext = [any, any, GraphqlContext, GraphQLResolveInfo];

export const AcceptLang = createParamDecorator<unknown, ExecutionContext, string | Promise<string>>((_data, host) => {
  const [, , ctx] = host.getArgs<GraphQLExecutionContext>();
  return ctx?.req?.acceptsLanguages(['en', 'vi']) || 'en';
});

export const GraphQLInfo = createParamDecorator<any, ExecutionContext, GraphQLResolveInfo>((_data, host) => {
  const [, , , info] = host.getArgs<GraphQLExecutionContext>();
  return info;
});

export const CurrentUser = createParamDecorator<string, ExecutionContext, any>((_data, host) => {
  const [, , ctx] = host.getArgs<GraphQLExecutionContext>();
  return ctx?.req?.user;
});

export const CurrentUserRest = createParamDecorator<keyof User, ExecutionContext, any>((field, ctx) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const user = request.user as User;

  // eslint-disable-next-line security/detect-object-injection
  if (user && field) return user[field];
  return user;
});

export const AuthJwt = () => {
  return applyDecorators(UseGuards(GqlAuthGuard));
};

export const AuthCookie = () => {
  return applyDecorators(UseGuards(GqlCookieAuthGuard));
};

export const RestAuthCookie = () => {
  return applyDecorators(UseGuards(CookieAuthGuard));
};
