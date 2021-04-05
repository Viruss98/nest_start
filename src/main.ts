import './dotenv-config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';
import compression from 'compression';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { UserInputError } from 'apollo-server';
import { json } from 'body-parser';
const PORT = parseInt(process.env.PORT ?? '3000', 10);

// const numCPUs = cpus().length;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: process.env.NODE_ENV === 'production' ? false : ['error', 'debug', 'warn'],
    cors: true,
    bodyParser: true,
  });

  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: true,
      validateCustomDecorators: false,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => {
        const errData: Record<string, any> = {};
        errors.map((v) => {
          errData[v.property] = v.constraints;
        });
        throw new UserInputError('Validation failed', errData);
      },
    }),
  );
  app.use(json({ limit: '50mb' })); //if not set, the default limit defined by body-parser is 100kb
  app.use(helmet());
  app.use(compression());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(PORT);
  console.info(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().finally(() => {
  //
});

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});
