import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './schemas/game.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import { GetGamesDto } from './dto/get-games.dto';

@Injectable()
export class GamesService {
  constructor(@InjectModel(Game.name) readonly gameModel: Model<Game>) {}

  async createGame(userId: string, dto: CreateGameDto) {
    const game = await this.gameModel.create({ ...dto, createdBy: userId });

    return game;
  }

  async getGames(dto: GetGamesDto) {
    const filter: FilterQuery<Game> = {};

    if (dto.status) filter.status = dto.status;

    const games = await this.gameModel
      .find(filter)
      .select('roomName createdBy teamCount')
      .lean()
      .exec();

    return { message: 'Games fetched.', data: { games } };
  }
}
