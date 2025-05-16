import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema, GameStatus } from './schemas/game.schema';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { GamesGateway } from './games.gateway';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MongooseModule.forFeatureAsync([
      {
        name: Game.name,
        useFactory() {
          const schema = GameSchema;

          // delete unplayed games after a day
          schema.index(
            { createdAt: 1 },
            {
              expires: '1d',
              partialFilterExpression: { status: GameStatus.PENDING },
            },
          );

          return schema;
        },
      },
    ]),
  ],
  providers: [GamesService, GamesGateway],
  controllers: [GamesController],
})
export class GamesModule {}
