import { IsEnum, IsOptional } from 'class-validator';
import { GameStatus } from '../schemas/game.schema';

export class GetGamesDto {
  @IsEnum(GameStatus)
  @IsOptional()
  status?: GameStatus;
}
