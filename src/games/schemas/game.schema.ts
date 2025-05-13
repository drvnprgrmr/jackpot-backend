import { Prop, Schema } from '@nestjs/mongoose';
import { Card } from './card.schema';
import { Player } from './player.schema';
import { Team } from './team.schema';

export enum GameStatus {
  PENDING = 'pending',
  ONGOING = 'ongoing',
  ENDED = 'ended',
}

@Schema({ timestamps: true })
export class Game {
  @Prop({ type: String })
  roomName: string;

  @Prop({ type: [Player] })
  players: Player[];

  @Prop({ required: true, min: 2, max: 6 })
  teamCount: number;

  @Prop({ type: [Team] })
  teams: Team[];

  // face down cards you draw from
  @Prop({ type: [Card] })
  drawPile: Card[];

  // face up cards you play on
  @Prop({ type: [Card] })
  discardPile: Card[];

  @Prop({
    type: String,
    required: true,
    enum: GameStatus,
    default: GameStatus.PENDING,
  })
  status: GameStatus;
}
