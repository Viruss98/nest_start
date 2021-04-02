import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { GraphQLContext } from 'src/graphql/app.graphql-context';
import { AuthenticationError } from 'apollo-server';
import jwtDecode from 'jwt-decode';
import { JWTDecodeValue } from 'src/modules/auth/auth.interface';
import { ExtractJwt } from 'passport-jwt';

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

@Injectable()
export class GqlAppAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext<GraphQLContext>();
    const accessToken = ExtractJwt.fromAuthHeaderWithScheme('bearer')(ctx.req);
    if (!accessToken) return false;
    const token: JWTDecodeValue = jwtDecode(accessToken);
    // console.log('token', token);
    if (token.aud?.includes('admin')) return false;
    return super.canActivate(context);
  }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext<GraphQLContext>();
    if (!ctx) {
      throw new AuthenticationError('Unauthorized');
    }
    return ctx.req;
  }
}

@Injectable()
export class GqlAuthSubGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    // req used in http queries and mutations, connection is used in websocket subscription connections, check AppModule
    const { req, connection } = ctx.getContext();
    // if subscriptions/webSockets, let it pass headers from connection.context to passport-jwt
    return connection && connection.context && connection.context.headers ? connection.context : req;
  }
}

@Injectable()
export class GqlAdminAuthGuard extends AuthGuard('cookie') {
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext<GraphQLContext>();
    const accessToken = ctx.req.cookies.token;
    if (!accessToken) return false;
    const token: JWTDecodeValue = jwtDecode(accessToken);
    if (token.aud?.includes('user')) return false;
    return super.canActivate(context);
  }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext<GraphQLContext>();
    if (!ctx) {
      throw new AuthenticationError('Unauthorized');
    }
    return ctx.req;
  }
}

@Injectable()
export class GqlAppNoRequireAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext<GraphQLContext>();
    const accessToken = ExtractJwt.fromAuthHeaderWithScheme('bearer')(ctx.req);
    if (!accessToken) return true;
    const token: JWTDecodeValue = jwtDecode(accessToken);

    if (token.aud?.includes('admin')) return true;
    return super.canActivate(context);
  }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext<GraphQLContext>();
    if (!ctx) {
      throw new AuthenticationError('Unauthorized');
    }
    return ctx.req;
  }
}

@Injectable()
export class GqlSupperAdminAuthGuard extends AuthGuard('cookie') {
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext<GraphQLContext>();
    const accessToken = ctx.req.cookies.token;
    if (!accessToken) return false;
    const token: JWTDecodeValue = jwtDecode(accessToken);
    if (token.aud?.includes('super_admin')) {
      return super.canActivate(context);
    }
    return false;
  }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext<GraphQLContext>();
    if (!ctx) {
      throw new AuthenticationError('Unauthorized');
    }
    return ctx.req;
  }
}