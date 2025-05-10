import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';
import { UserNotFoundException } from 'src/users/exceptions';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto) {
    const user = await this.usersService.createUser({
      username: dto.username,
      password: await bcrypt.hash(dto.password, 10),
    });

    const token = this.jwtService.sign({ sub: user.id as string });

    // unset password field before returning
    user.password = '';
    return { message: 'Signed up.', data: { user, token } };
  }

  async signIn(dto: SignInDto) {
    const user = await this.usersService.userModel
      .findOne({ username: dto.username })
      .exec();

    if (!user) throw new UserNotFoundException();
    else if (!(await bcrypt.compare(dto.password, user.password)))
      throw new UnauthorizedException({ message: 'Wrong password.' });

    const token = this.jwtService.sign({ sub: user.id as string });

    // unset password field before returning
    user.password = '';
    return { message: 'Signed in.', data: { user, token } };
  }
}
