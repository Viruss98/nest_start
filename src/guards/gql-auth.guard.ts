import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { GraphQLContext } from 'src/graphql/app.graphql-context';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx: GraphQLContext = GqlExecutionContext.create(context).getContext();
    return ctx.req;
  }
}

@Injectable()
export class GqlCookieAuthGuard extends AuthGuard('cookie') {
  getRequest(context: ExecutionContext) {
    const ctx: GraphQLContext = GqlExecutionContext.create(context).getContext();
    return ctx.req;
  }
}
