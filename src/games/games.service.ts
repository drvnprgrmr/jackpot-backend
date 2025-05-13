import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './schemas/game.schema';
import { Model } from 'mongoose';

@Injectable()
export class GamesService {
  constructor(@InjectModel(Game.name) readonly gameModel: Model<Game>) {}

  async createGame(dto: CreateGameDto) {
    const game = await this.gameModel.create(dto);

    return game;
  }

  // todo: delete unplayed games
}
