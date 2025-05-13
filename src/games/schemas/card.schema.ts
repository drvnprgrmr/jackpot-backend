import { Prop } from '@nestjs/mongoose';

export const suits = ['Circle', 'Triangle', 'Cross', 'Square', 'Star'];
export type Suit = 'Circle' | 'Triangle' | 'Cross' | 'Square' | 'Star' | 'Whot';

export const circleAndTriangleNumbers = [
  1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14,
];
export type CircleAndTriangleNumber =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 7
  | 8
  | 10
  | 11
  | 12
  | 13
  | 14;

export const crossAndSquareNumbers = [1, 2, 3, 5, 7, 10, 11, 13, 14];
export type CrossAndSquareNumber = 1 | 2 | 3 | 5 | 7 | 10 | 11 | 13 | 14;

export const starNumbers = [1, 2, 3, 4, 5, 7, 8];
export type StarNumber = 1 | 2 | 3 | 4 | 5 | 7 | 8;

export const whotNumber = 20;
export type WhotNumber = 20;

export class Card {
  @Prop({ type: String, required: true, enum: suits })
  suit: 'Circle' | 'Triangle' | 'Cross' | 'Square' | 'Star' | 'Whot';

  @Prop({ type: Number, required: true, min: 1, max: 20 })
  number:
    | CircleAndTriangleNumber
    | CrossAndSquareNumber
    | StarNumber
    | WhotNumber;
}
