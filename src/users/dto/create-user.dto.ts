import { IsStrongPassword, Matches } from 'class-validator';

export class CreateUserDto {
  @Matches(/^[a-z][a-zA-Z0-9_]{2,15}$/)
  username: string;

  @IsStrongPassword()
  password: string;
}
