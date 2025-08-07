import { LoggerModule } from 'nestjs-pino';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export const loggerConfig: ReturnType<typeof LoggerModule.forRoot> =
  LoggerModule.forRoot({
    pinoHttp: {
      level: isProduction ? 'info' : 'debug',
      transport: {
        targets: isProduction
          ? [
              {
                target: 'pino/file',
                level: 'info',
                options: {
                  destination: path.join(process.cwd(), './logs/app.log'),
                  mkdir: true,
                  translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
                },
                worker: {
                  autoEnd: true,
                },
              },
            ]
          : [
              {
                target: 'pino-pretty',
                level: 'debug',
                options: {
                  singleLine: true,
                  translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
                  ignore: 'pid,hostname',
                },
              },
            ],
      },
    },
  });
