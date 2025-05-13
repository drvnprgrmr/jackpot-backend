import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateGameDto } from './dto/create-game.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @UseGuards(AuthGuard)
  @Post()
  createGame(@Body() dto: CreateGameDto) {
    return this.gamesService.createGame(dto);
  }
}
