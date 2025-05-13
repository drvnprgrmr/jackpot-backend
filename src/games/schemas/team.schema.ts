import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MSchema, Types } from 'mongoose';

@Schema()
export class Team {
  @Prop({ required: true, min: 1, max: 5 })
  number: number;

  @Prop({ type: [MSchema.Types.ObjectId] })
  players: Types.ObjectId[];
}
