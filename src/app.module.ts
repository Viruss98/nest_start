import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SES } from 'aws-sdk';
import nodemailer from 'nodemailer';
import { AppController } from './app.controller';
// import { gqlOptions } from './graphql/gql-options';
import { AuthModule } from './modules/auth/auth.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { CategoryModule } from './modules/category/category.module';
import { CommonModule } from './modules/common/common.module';
// import { MediaModule } from './modules/media/media.module';
import { UsersModule } from './modules/users/users.module';
import { typeORMConfig } from './typeorm.config';
import { ProductsModule } from './modules/products/products.module';
import { ProductgroupModule } from './modules/productgroup/productgroup.module';
import { ProductcateModule } from './modules/productcate/productcate.module';
import { Request, Response } from 'express';
// import { GqlModuleOptions } from '@nestjs/graphql';
import { ApolloComplexityPlugin } from './graphql/plugins/ApolloComplexityPlugin';
import { ConnectionContext } from 'subscriptions-transport-ws';
import { JWTDecodeValue } from './modules/auth/auth.interface';
import { UsersService } from 'src/modules/users/services/users.service';
import jwtDecode from 'jwt-decode';
import { AuthenticationError } from 'apollo-server';
import { ChatModule } from 'src/modules/chat/chat.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    // MediaModule.forRoot({
    //   uploadDir: 'uploads',
    //   quality: 70,
    // }),
    GraphQLModule.forRootAsync({
      imports: [UsersModule],
      useFactory: async (usersService: UsersService) => ({
        fieldResolverEnhancers: ['guards', 'filters', 'interceptors'],
        path: '/graphql',
        uploads: {
          maxFieldSize: 100 * 1000000, // 100MB
          maxFileSize: 50 * 1000000, // 50 MB
          maxFiles: 20,
        },
        playground: true,
        debug: true,
        installSubscriptionHandlers: true,
        autoSchemaFile: true,
        tracing: false,
        plugins: [new ApolloComplexityPlugin(100)],
        subscriptions: {
          // get headers
          path: '/subscriptions',
          keepAlive: 30000,
          onConnect: async (connectionParams: any, context: any) => {
            const headers = connectionParams?.headers;
            const authToken: string = headers?.authorization && headers?.authorization.split(' ')[1];
            if (authToken && authToken !== 'null') {
              const token: JWTDecodeValue = jwtDecode(authToken);
              const userInfo = await usersService.findById(token.sub);
              return { user: userInfo, headers: headers };
            }
            throw new AuthenticationError('authToken must be provided');
          },
          onDisconnect: async (websocket, context: ConnectionContext) => {
            const { subscriptionClient } = await context.initPromise;
            if (subscriptionClient) {
              subscriptionClient.close();
            }
          },
        },
        context: ({ req, res, payload, connection }: { req: Request; res: Response; payload: any; connection: any }) => {
          if (connection) {
            // check connection for metadata
            return { req: connection.context as Request, res };
          } else {
            // check from req
            // return new GraphQLContext(req, res);
            return { req, res };
          }
        },
        resolverValidationOptions: {
          requireResolversForResolveType: false,
        },
      }),
      inject: [UsersService],
    }),
    AuthModule.forRoot({
      secret: 'object1_secret',
    }),
    MailerModule.forRoot({
      transport: nodemailer.createTransport({
        SES: new SES({
          apiVersion: '2010-12-01',
        }),
      }),
      defaults: {
        from: '"OS8 NTQ" <os8.ntq@yopmail.com>',
      },
      template: {
        dir: __dirname + '/templates',
        // adapter: new HandlerBa(),
        options: {
          strict: true,
        },
      },
    }),
    UsersModule,
    BlogsModule,
    CommonModule,
    CategoryModule,
    ProductsModule,
    ProductgroupModule,
    ProductcateModule,
    ChatModule,
    NotificationModule,
  ],
  // providers: [JSONObjectScalar],
  controllers: [AppController],
})
export class AppModule {}
