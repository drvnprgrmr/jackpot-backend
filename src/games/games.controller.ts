import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { AuthGuard, UserPopulatedRequest } from 'src/auth/auth.guard';
import { CreateGameDto } from './dto/create-game.dto';
import { GetGamesDto } from './dto/get-games.dto';

@UseGuards(AuthGuard)
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  createGame(@Req() req: UserPopulatedRequest, @Body() body: CreateGameDto) {
    return this.gamesService.createGame(req.user.id as string, body);
  }

  @Get()
  getGames(@Query() query: GetGamesDto) {
    return this.gamesService.getGames(query);
  }
}
