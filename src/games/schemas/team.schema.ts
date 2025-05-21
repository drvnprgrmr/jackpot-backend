import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as MSchema, Types } from 'mongoose';
import { generate } from 'random-words';

@Schema()
export class Team {
  @Prop({
    required: true,
    default: () =>
      generate({ exactly: 1, minLength: 4, maxLength: 5, join: '' }),
  })
  name?: string;

  @Prop({ type: [MSchema.Types.ObjectId], min: 0, max: 2, unique: true })
  players: Types.ObjectId[] | string[];
}
