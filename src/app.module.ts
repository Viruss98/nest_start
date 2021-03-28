import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SES } from 'aws-sdk';
import nodemailer from 'nodemailer';
import { AppController } from './app.controller';
import { gqlOptions } from './graphql/gql-options';
import { AuthModule } from './modules/auth/auth.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { CategoryModule } from './modules/category/category.module';
import { CommonModule } from './modules/common/common.module';
import { MediaModule } from './modules/media/media.module';
import { UsersModule } from './modules/users/users.module';
import { typeORMConfig } from './typeorm.config';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    MediaModule.forRoot({
      uploadDir: 'uploads',
      quality: 70,
    }),
    GraphQLModule.forRoot(gqlOptions),
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
  ],
  // providers: [JSONObjectScalar],
  controllers: [AppController],
})
export class AppModule {}
