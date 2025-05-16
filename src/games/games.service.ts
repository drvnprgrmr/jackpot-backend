import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './schemas/game.schema';
import { FilterQuery, isValidObjectId, Model, Types } from 'mongoose';
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

    return { message: `Games fetched. (${games.length})`, data: { games } };
  }

  async getGame(nameOrId: string) {
    const filter: FilterQuery<Game> = {};

    if (isValidObjectId(nameOrId)) filter._id = nameOrId;
    else filter.roomName = nameOrId;

    const game = await this.gameModel
      .findOne(filter)
      .select('-drawPile -discardPile')
      .lean()
      .exec();

    if (!game)
      throw new BadRequestException({
        message: `No game with nameOrId: ${nameOrId} found.`,
      });

    return { message: 'Game fetched.', data: { game } };
  }
}
