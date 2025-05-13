import { Prop } from '@nestjs/mongoose';

export const suits = ['Circle', 'Triangle', 'Cross', 'Square', 'Star'];
export type Suit = 'Circle' | 'Triangle' | 'Cross' | 'Square' | 'Star' | 'Whot';

export const circleAndTriangleNumbers: CircleAndTriangleNumber[] = [
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

export const crossAndSquareNumbers: CrossAndSquareNumber[] = [
  1, 2, 3, 5, 7, 10, 11, 13, 14,
];
export type CrossAndSquareNumber = 1 | 2 | 3 | 5 | 7 | 10 | 11 | 13 | 14;

export const starNumbers: StarNumber[] = [1, 2, 3, 4, 5, 7, 8];
export type StarNumber = 1 | 2 | 3 | 4 | 5 | 7 | 8;

export const whotNumber: WhotNumber = 20;
export type WhotNumber = 20;

export type SuitNumber =
  | CircleAndTriangleNumber
  | CrossAndSquareNumber
  | StarNumber
  | WhotNumber;

export class Card {
  constructor(suit: Suit, number: SuitNumber) {
    this.suit = suit;
    this.number = number;
  }

  @Prop({ type: String, required: true, enum: suits })
  suit: 'Circle' | 'Triangle' | 'Cross' | 'Square' | 'Star' | 'Whot';

  @Prop({ type: Number, required: true, min: 1, max: 20 })
  number: SuitNumber;
}

export function generateDeck() {
  const deck: Card[] = [];

  // add circle and triangle suits
  ['Circle', 'Triangle'].forEach((suit: Suit) => {
    for (const n of circleAndTriangleNumbers) deck.push(new Card(suit, n));
  });

  // add cross and square suits
  ['Cross', 'Square'].forEach((suit: Suit) => {
    for (const n of crossAndSquareNumbers) deck.push(new Card(suit, n));
  });

  // add star suit
  for (const n of starNumbers) deck.push(new Card('Star', n));

  // add special 'Whot' cards
  deck.push(...Array.from({ length: 5 }, () => new Card('Whot', 20)));

  // shuffle deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}
