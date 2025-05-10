import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isValidObjectId } from 'mongoose';
import { IncomingMessage } from 'node:http';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request & IncomingMessage = context
      .switchToHttp()
      .getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token)
      throw new BadRequestException({
        message: 'Authorization token not present!',
      });

    let payload: { sub: string; typ: string };
    try {
      payload = await this.jwtService.verifyAsync(token);

      if (!isValidObjectId(payload.sub)) throw new Error();
    } catch {
      throw new UnauthorizedException({ message: 'Invalid token!' });
    }

    const user = await this.usersService.getUserByIdOrThrow(payload.sub);

    request['user'] = user;

    return true;
  }

  private extractTokenFromHeader(
    req: Request & IncomingMessage,
  ): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
