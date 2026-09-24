import { NestFactory } from '@nestjs/core';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import type { Express, Request, Response } from 'express';

dotenv.config({ override: true });

let cachedServer: Express | null = null;
let cachedApp: INestApplication | null = null;

async function createNestServer(): Promise<{
  app: INestApplication;
  server: Express;
}> {
  if (cachedServer && cachedApp) {
    return { app: cachedApp, server: cachedServer };
  }

  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: { policy: 'unsafe-none' },
  }));


  // URL normalization middleware: strip any accidental /n/ prefix from rogue env vars or escaped paths
  app.use((req: Request, res: Response, next: () => void) => {
    if (req.url && (req.url.startsWith('/n/') || req.url === '/n')) {
      req.url = req.url.replace(/^\/n(\/|$)/, '/');
    }
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: [
      /^http:\/\/(localhost|127\.0\.0\.1):[0-9]+$/,
      /^http:\/\/192\.168\.[0-9]+\.[0-9]+:[0-9]+$/,
      /^http:\/\/10\.[0-9]+\.[0-9]+\.[0-9]+:[0-9]+$/,
      /^https:\/\/dellics.*\.vercel\.app$/,
      'https://dellicstravels.com',
      'https://www.dellicstravels.com',
      'https://consult.dellicstravels.com',
      'https://admin.dellicstravels.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
  });

  await app.init();

  const server = app.getHttpAdapter().getInstance() as Express;
  cachedApp = app;
  cachedServer = server;

  return { app, server };
}

// Vercel Serverless Function entry point
export default async function handler(
  req: Request,
  res: Response,
): Promise<void> {
  const { server } = await createNestServer();
  server(req, res);
}

// Local standalone server bootstrap (runs when executed directly or via npm run start:dev)
if (!process.env.VERCEL) {
  async function bootstrap(): Promise<void> {
    const { app } = await createNestServer();
    const port = Number(process.env.PORT ?? 3000);
    await app.listen(port);
    console.log(
      `[Dellics API] Server running locally on http://localhost:${port}`,
    );
  }

  void bootstrap().catch((err: unknown) => {
    console.error('[Dellics API] Bootstrap Failure:', err);
  });
}
