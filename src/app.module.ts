import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration, Config } from './config';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService<Config, true>) {
        const logger = new Logger(MongooseModule.name);

        const mongoUri = configService.get('mongoUri', { infer: true });

        return {
          uri: mongoUri,
          onConnectionCreate: (connection: Connection) => {
            connection.on('connected', () => logger.log('connected'));
            connection.on('open', () => logger.log('open'));
            connection.on('disconnected', () => logger.log('disconnected'));
            connection.on('reconnected', () => logger.log('reconnected'));
            connection.on('disconnecting', () => logger.log('disconnecting'));

            return connection;
          },
        };
      },
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
    UsersModule,
    GamesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
