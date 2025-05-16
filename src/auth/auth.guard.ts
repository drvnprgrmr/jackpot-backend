import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isValidObjectId } from 'mongoose';
import { IncomingMessage } from 'node:http';
import { UserDocument } from 'src/users/schemas/users.schema';
import { UsersService } from 'src/users/users.service';

export type UserPopulatedRequest = Request & { user: UserDocument };

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger(AuthGuard.name);

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
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException(
        { message: 'Invalid token!' },
        { cause: err },
      );
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
