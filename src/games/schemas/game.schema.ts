import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Card, generateDeck } from './card.schema';
import { Player } from './player.schema';
import { Team } from './team.schema';
import { generate } from 'random-words';
import { HydratedDocument, Types, Schema as MSchema } from 'mongoose';

export enum GameStatus {
  PENDING = 'pending',
  ONGOING = 'ongoing',
  ENDED = 'ended',
}

export type GameDocument = HydratedDocument<Game>;

@Schema({ timestamps: true })
export class Game {
  @Prop({
    type: String,
    required: true,
    unique: true,
    immutable: true,
    default: () => generate({ exactly: 3, maxLength: 5, join: '-' }),
  })
  roomName: string;

  @Prop({
    type: MSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    immutable: true,
  })
  createdBy: Types.ObjectId;

  @Prop({ type: [Player] })
  players: Player[];

  @Prop({ required: true, min: 2, max: 6 })
  teamCount: number;

  @Prop({ type: [Team] })
  teams: Team[];

  // face down cards you draw from
  @Prop({ type: [Card], default: generateDeck })
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

export const GameSchema = SchemaFactory.createForClass(Game);
