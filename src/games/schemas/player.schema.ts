import { Schema, Prop } from '@nestjs/mongoose';
import { Schema as MSchema, Types } from 'mongoose';
import { Card } from './card.schema';

@Schema()
export class Player {
  @Prop({ type: MSchema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId | string;

  @Prop({ type: [Card] })
  cards: Card[];
}
