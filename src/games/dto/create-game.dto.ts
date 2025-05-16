import { IsNumber, Max, Min } from 'class-validator';

export class CreateGameDto {
  @IsNumber()
  @Min(2)
  @Max(6)
  teamCount: number;
}
